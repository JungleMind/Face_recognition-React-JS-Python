import React, { useEffect, useState,useRef } from 'react'
import './Liste.css'
import axios from 'axios'
import Context from "./Context";
import "font-awesome/css/font-awesome.css";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { FcBusinessman } from "react-icons/fc";
import { BsPlusLg } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import ligne from './images/ligne.png';
import { IoTrash } from "react-icons/io5";
import { IoAlertCircleOutline } from "react-icons/io5";
import trash from './images/trash.png';

import Modal from 'react-modal'

 
const initialState = {
   nom:"",
   adresse:"",
   telephone:"",
   mail:"",
   photo:""
}
export default function Person() {
   const [users, setUsers] = useState([]);
   const [daty,setDaty] = useState(new Date());
   const [show,setShow] =useState(false);
   const [state,setState] = useState(initialState);
   const [selectedfile, setFiles] = useState(null)
   const inputRef = useRef()
   const [showDelete,setShowdelete] =useState(false);
   const [idDelete,setId] = useState(null)
   const [nomDelete,setNom] = useState(null)
   const [loading,setLoading]=useState(false)

   const {nom,adresse,niveau,telephone,mail,photo} = state;

   const loadData = async()=>{
      const response = await axios.get("http://localhost:8000/liste");
      setUsers(response.data);
   }

   useEffect(() => {
     getUsers();
     loadData();
   }, []);

   const deletePersonne = (id)=>{
    axios.delete("http://localhost:8000/delete/"+id).then(function (response) {
      window.location.reload(true)
   });
}

   function getUsers() {
      axios.get("http://localhost:8000/liste").then(function (response) {
        if (response.status === 200) {
          setUsers(response.data);
        } else {
          console.log("Vous n'êtes pas autorisé à accéder à cette page!");
        }
      });
    }

   const showModal = ()=>{
      if(!show){
         setShow(true);
      }
   }

   const handleSubmit = (e) => {
    
      
      e.preventDefault();
      if(!nom || !adresse || !telephone || !mail){

      }
      else{
         axios.post("http://localhost:8000/add",{  
            nom,
            adresse,
            telephone,
            mail,
            niveau
         }).then(()=>{
            setState({nom:"",adresse:"",telephone:"",mail:"",photo:"",niveau:""});
            
            axios.get("http://localhost:8000/lastId").then(function (response) {
               if (response.status === 200) {
                  onFileUpload(response.data.id);
               } else {
                 console.log("Vous n'êtes pas autorisé à accéder à cette page!");
               }
             });
 
         }).catch((err) => alert(JSON.stringify(err.response.data)));
      }
   }

   const onFileUpload = (id) => {

      setShow(false)
      setLoading(true)
      // Create an object of formData
      const photo = new FormData();
     
      // Update the formData object
      photo.append(
        "photo",
        selectedfile,
        selectedfile.name,
      );
      
      console.log("Photo")
      console.log(photo)

      axios.put("http://localhost:8000/image/"+id,photo).then(()=>{
         //window.location.reload(true)
         setLoading(false)
      }).catch((err) => alert(JSON.stringify(err)));
    };

   const handleInputChange = (e) => {
      const {name,value} = e.target;
      setState({...state, [name]:value});
   }

   const handlePhoto = (e) => {
      const selectedFiles = inputRef.current.files[0];
      var data = new FormData();
      data.append('file', selectedFiles);
      setFiles(inputRef.current.files[0])
   }

   const closeModal = ()=>{
      setShow(false);
   }

   const closeModalsupp = ()=>{
      setShowdelete(false);
   }
        return (
         <>
            <Context/>
            
            <div class="container">
            <div id='ligne1'>
                  <img src={ligne} alt="Face"/>
               </div>
               <div id='ligne2'>
                  <img src={ligne} alt="Face"/>
               </div>
               <div id='titrekely'>
                  <p>Personnes enregistrées</p>
               </div>
               <div id='btn_ajouter' onClick={showModal}>
                  <BsPlusLg style={{marginRight:'10px'}} size={10}/>
                  Ajouter
               </div>
               <div id='daty'>
                  <p>Aujourd'hui</p>
                  <p>{daty.getDate()} - 0{daty.getMonth() + 1 } - {daty.getFullYear()} </p>
               </div>
               <div id='content'>
                 
                  <div id='nbuser'>
                     <div id='man'>
                        <FcBusinessman  size={27}/>
                     </div>
                     <p id='nb'>
                        {users.length}
                     </p>
                     <p id='pers'>
                        Personnes
                     </p>
                  </div>
               </div>
    
               <div id='contenuIndividu'>

                  {users.length != 0 &&  users.map((user,index) => (
                     // <Link class="link" to={'/about/'+user.id}>
                     <div class="individu">
                        <div class='rond'>
                           <img  src ={require('../../backend/Images/'+user.photo)} alt={user.nom}/>
                        </div>
                        <p>{user.nom}</p> 
                        <div id='trash' onClick={()=>{
                           setId(user.id)
                           setNom(user.nom)
                           setShowdelete(true)
                           }}>
                           <IoTrash size={15} color="#888c8d"/>
                        </div>
                        <Modal 
                           isOpen={showDelete}
                           contentLabel="Minimal Modal Example"
                           onRequestClose={closeModalsupp}
                           overlayClassName="Overlay1"
                           className="contenuModalSupp"
                        >
                           <div>
                              <div id='close' onClick={closeModalsupp}>
                                 <BsX  size={25} color="white"/>
                              </div>
                              <div id='fako'>
                                 <div class='blob'>
                                 </div>
                                 <img src={trash} />
                              </div>
                              <div id='sur'>
                                 <p>Voulez vous supprimer les données de <b style={{color:'#008BBE'}}>{nomDelete}</b> ?</p>
                              </div>
                              <div id='sur1'>
                                 <p>Cette action est irreversible et vos données seront perdues.</p>
                              </div>
                              <div id='confirmer'>
                                 <div id='oui' onClick={()=>deletePersonne(idDelete)}>
                                    Supprimer
                                 </div>
                                 <div id='non' onClick={()=>{
                                    closeModalsupp();
                                    setNom(null)
                                    setId(null)
                                 }}>
                                    Annuler
                                 </div>
                              </div>
                           </div>
                        </Modal>
                     </div>
                     // </Link>
                  ))}
              
                  {/* <table className="styled-table">
                     <thead>
                        <tr>
                            <th style={{textAlign:"center"}}>N°</th>
                            <th style={{textAlign:"center"}}>Nom</th>
                            <th style={{textAlign:"center"}}>Adresse</th>
                            <th style={{textAlign:"center"}}>Téléphone</th>
                            <th style={{textAlign:"center"}}>Mail</th>
                            <th style={{textAlign:"center"}}>Photo</th>
                            <th style={{textAlign:"center"}}><i class="fa fa-cog"></i></th>
                        </tr>
                     </thead>            
                     
                     <tbody> 
                     {users.map((user,index) => (
                        <tr key={index}>
                           <td>{user.id}</td>
                           <td>{user.nom}</td>
                           <td>{user.adresse}</td>
                           <td>{user.telephone}</td>
                           <td>{user.mail}</td>
                           <td>
                              <img src ={user.photo} alt={user.nom}/>
                             
                           </td>

                           <td>
                                <Link to={'/about/'+user.id}>
                                    <button class="btn btn-view"><i class="fa fa-eye"></i></button> 
                                </Link>

                                <Link to={'/update/'+user.id}>
                                    <button class="btn btn-edit"><i class="fa fa-edit"></i></button> 
                                </Link>

                                <Link>
                                    <button class="btn btn-delete" onClick={()=>deletePersonne(user.id)}><i class="fa fa-trash"></i></button> 
                                </Link>
                           </td>
                        </tr>
                     ))}
                     </tbody>            
               </table> */}
               </div>    
               {loading && (
                  <div className="spinner-container">
                  <div className="loading-spinner">
                  </div>
               </div> 
               )}
                        
         <Modal 
            isOpen={show}
            contentLabel="Minimal Modal Example"
            onRequestClose={closeModal}
            overlayClassName="Overlay"
            className="contenuModal"
            >
            <div>
               <div id='close' onClick={closeModal}>
                  <BsX  size={25} color="white"/>
               </div>
               <div>
                  <p id='ajouter'>Ajouter une personne</p>
               <form style={{
                  margin:"auto",
                  padding:"15px",
                  maxWidth:"85%",
                  alignContent:"center"
               }}
                  onSubmit={handleSubmit}
               >
                  <input
                     class="input"
                     type="text"
                     id="nom"
                     name="nom"
                     placeholder="Votre nom"
                     value={nom}
                     onChange={handleInputChange}
                     required
                  />

                  <input
                  class="input"
                     type="text"
                     id="adresse"
                     name="adresse"
                     placeholder="Votre adresse"
                     value={adresse}
                     onChange={handleInputChange}
                     required
                  />

                  <input
                     class="input"
                     type="text"
                     id="niveau"
                     name="niveau"
                     placeholder="Niveau"
                     value={niveau}
                     onChange={handleInputChange}
                     required
                  />

                  <input
                  class="input"
                     type="number"
                     id="telephone"
                     name="telephone"
                     placeholder="Votre numéro de téléphone"
                     value={telephone}
                     onChange={handleInputChange}
                     required
                  />

                  <input
                  class="input"
                     type="email"
                     id="mail"
                     name="mail"
                     placeholder="Votre adresse e-mail"
                     value={mail}
                     onChange={handleInputChange}
                     required
                  />

                  <input 
                     type="file" 
                     name="photo" 
                     id="photo"
                     class="form-control input"
                     onChange={handlePhoto}
                     ref={inputRef}
                     required
                     />

                  <input type="submit" value="Enregistrer" id='btn_enregistrer'/>
               </form>  
               </div>
            </div>
            
               
                  
               
            
           
         </Modal>
        
            </div>
         </>
        );
}
