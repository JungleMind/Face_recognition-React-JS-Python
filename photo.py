from fastapi import FastAPI,Response,UploadFile,File
import cv2
import dlib
from PIL import Image
import numpy as np
from imutils import face_utils
from pathlib import Path
import os
import json
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
import uvicorn
import ntpath
import shutil
from datetime import date

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

connection = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="faciale"
)

class Personne(BaseModel):
    nom:str
    niveau:str
    adresse:str
    telephone:str
    mail:str

cursor = connection.cursor()
@app.get("/")
def index():
    return "Salut"

#Lister toutes les personnes
@app.get("/liste")
def list():
    sql = "SELECT * FROM personne group by id asc"
    param_values = ()
    cursor.execute(sql,param_values)
    results = cursor.fetchall()
    personne = []
    content = {}
    for result in results:
        content = {'id': result[0], 'nom': result[1],'niveau': result[2], 'adresse': result[3], 'telephone': result[4], 'mail': result[5], 'photo': result[6]}
        personne.append(content)
    return personne

#Afficher les informations d'une personne
@app.get("/about/{id}")
def getInformation(id):
    sql = "SELECT * FROM personne WHERE id ="+id
    param_values = ()
    cursor.execute(sql,param_values)
    results = cursor.fetchall()
    content = {}
    for result in results:
        content = {'id': result[0], 'nom': result[1],'niveau': result[2], 'adresse': result[3], 'telephone': result[4], 'mail': result[5], 'photo': result[6]}
    return content

@app.get("/lastId")
def list():
    sql = "SELECT * FROM personne ORDER BY id desc LIMIT 1"
    param_values = ()
    cursor.execute(sql,param_values)
    results = cursor.fetchall()
    content = {}
    for result in results:
        content =  {'id': result[0]}
    return content

#Supprimer une Personne
@app.delete("/delete/{id}")
def list(id):
    sql1 = "SELECT * FROM personne WHERE id ="+id
    param_values = ()
    cursor.execute(sql1,param_values)
    results = cursor.fetchall()
    for result in results:
        if os.path.exists(f'Images/{result[6]}'):
            os.remove(f'Images/{result[6]}')

    sql = "DELETE FROM personne WHERE id = "+id
    cursor.execute(sql)
    connection.commit()

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#Ajout Personne
@app.post("/add")
def add(personne:Personne):
    nom = personne.nom
    niveau = personne.niveau
    adresse = personne.adresse
    telephone = personne.telephone
    mail = personne.mail
  
    sql = "INSERT INTO personne (nom,niveau,adresse,telephone,mail) values(%s, %s, %s, %s, %s)"
    param_values = (nom,niveau,adresse,telephone,mail)
    cursor.execute(sql,param_values)
    connection.commit()

#Modification Personne    
@app.put("/edit/{id}")
def edit(id,personne:Personne):
    sql = "UPDATE personne SET nom = %s,niveau = %s,adresse = %s,telephone = %s, mail = %s WHERE id = "+id
    nom = personne.nom
    niveau = personne.niveau
    adresse = personne.adresse
    telephone = personne.telephone
    mail = personne.mail

    param_values = (nom,niveau,adresse,telephone,mail)
    cursor.execute(sql,param_values)
    connection.commit()

#Ajout Image d'une Personne        
@app.put("/image/{id}")
async def addImage(id,photo:UploadFile = File(...)):
    if photo.filename == '':
        message = { 'message' : 'No file selected'}
        return Response(json.dumps(message), status=400, mimetype='application/json')

    if photo and allowed_file(photo.filename):
        if not os.path.exists(f'Images'):
            os.makedirs(f'Images')

        sql = "SELECT * FROM personne WHERE id ="+id
        param_values = ()
        cursor.execute(sql,param_values)
        results = cursor.fetchall()
        for result in results:
            if os.path.exists(f'Images/{result[5]}'):
                os.remove(f'Images/{result[5]}')

            file_allocation = f"Images/{id}-{photo.filename}"
            with open(file_allocation,"wb+") as file_object:
                file_object.write(photo.file.read())

            image = id+"-"+photo.filename
            sql = "UPDATE personne SET photo = '"+image+"' WHERE id = "+id
            param_values = ()
            cursor.execute(sql,param_values)
            connection.commit()


#Reconnaissance faciale 
print('[INFO] Starting System...')
print('[INFO] Importing pretrained model..')
pose_predictor_68_point = dlib.shape_predictor("pretrained_model/shape_predictor_68_face_landmarks.dat")
pose_predictor_5_point = dlib.shape_predictor("pretrained_model/shape_predictor_5_face_landmarks.dat")
face_encoder = dlib.face_recognition_model_v1("pretrained_model/dlib_face_recognition_resnet_model_v1.dat")
face_detector = dlib.get_frontal_face_detector()
print('[INFO] Importing pretrained model..')


def transform(image, face_locations):
    coord_faces = []
    for face in face_locations:
        rect = face.top(), face.right(), face.bottom(), face.left()
        coord_face = max(rect[0], 0), min(rect[1], image.shape[1]), min(rect[2], image.shape[0]), max(rect[3], 0)
        coord_faces.append(coord_face)
    return coord_faces


def encode_face(image):
    face_locations = face_detector(image, 1)
    face_encodings_list = []
    landmarks_list = []
    for face_location in face_locations:
        # DETECT FACES
        shape = pose_predictor_68_point(image, face_location)
        face_encodings_list.append(np.array(face_encoder.compute_face_descriptor(image, shape, num_jitters=1)))
        # GET LANDMARKS
        shape = face_utils.shape_to_np(shape)
        landmarks_list.append(shape)
    face_locations = transform(image, face_locations)
    return face_encodings_list, face_locations, landmarks_list


def easy_face_reco(frame, known_face_encodings):
    # ENCODING FACE
    face_encodings_list, face_locations_list, landmarks_list = encode_face(frame)
    face_names = []
    for face_encoding in face_encodings_list:
        if len(face_encoding) == 0:
            return np.empty((0))
        # CHECK DISTANCE BETWEEN KNOWN FACES AND FACES DETECTED
        vectors = np.linalg.norm(known_face_encodings - face_encoding, axis=1)
        tolerance = 0.5
        result = []
        for vector in vectors:
            if vector <= tolerance:
                result.append(True)
            else:
                result.append(False)
        return result
    
@app.put("/check")
def check(photo:UploadFile = File(...)):
    if photo.filename == '':
        message = { 'message' : 'No file selected'}
        return Response(json.dumps(message), status=400, mimetype='application/json')

    if photo and allowed_file(photo.filename):
        print('[INFO] Importing faces...')
        for root, dirs, files in os.walk('Images'):
            print("root: ",root)
            print("fichiers: ",files)
            known_face_encodings = []
            known_face_names = []
            for file in files:
                paths = os.path.join(root,file)
                npImage = np.fromfile(paths,np.uint8)
                img = cv2.imdecode(npImage, cv2.COLOR_BGR2RGB)
                face_encoded = encode_face(img)[0][0]
                known_face_encodings.append(face_encoded)
            known_face_names = [os.path.splitext(file)[0] for file in files]

            print('[INFO] Faces well imported')
            print('[INFO] Starting Webcam...')
            if photo and allowed_file(photo.filename):
                if not os.path.exists(f'Dir'):
                    os.makedirs(f'Dir')
                file_allocation = f"Dir/{photo.filename}"
                image = photo.filename
                with open(file_allocation,"wb+") as file_object:
                    file_object.write(photo.file.read())
                
                for root, dirs, files in os.walk('Dir'):
                    print("root: ",root)
                    print("fichiers: ",files)
                    for file in files:
                        img = cv2.imread(f"Dir/{file}")

                        print('[INFO] Detecting...')
                        result = easy_face_reco(img, known_face_encodings)
                        if True in result:
                            first_match_index = result.index(True)
                            name = known_face_names[first_match_index]
                            print(name)
                            id = ((name).split('-'))[0]
                            print(id)
                            shutil.rmtree('Dir')
                            return id
                        if False in result:
                            name = "Inconnu"
                            print(name)
                            shutil.rmtree('Dir')
                            return name 

#Presence
@app.get("/presence/{id_etudiant}")
def presence(id_etudiant):
    sql = "INSERT INTO presence (id_etudiant,date) values(%s, %s)"
    id_etudiant = id_etudiant
    daty = date.today()

    param_values = (id_etudiant,daty)
    cursor.execute(sql,param_values)
    connection.commit()

#Liste des presences
@app.get("/list")
def listePresence():
    sql = "SELECT photo,personne.id as matricule,nom,niveau,date_format(date,'%d/%m/%Y') as daty,adresse,telephone,mail FROM presence, personne where personne.id = presence.id_etudiant group by presence.id desc"
    param_values = ()
    cursor.execute(sql,param_values)
    results = cursor.fetchall()
    personne = []
    content = {}
    for result in results:
        content = {'photo': result[0],'matricule': result[1], 'nom': result[2],'niveau': result[3], 'daty': result[4],'adresse': result[5],'telephone': result[6],'mail': result[7]}
        personne.append(content)
    return personne

if __name__ == '__main__':
    uvicorn.run(app, host="127.0.0.1", port=8000)