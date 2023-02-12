import React, { useState } from 'react'
import './Person.css'
import axios from 'axios'
import Context from "./Context";
import { toast } from 'react-toastify';


const initialState = {
   nom:"",
   adresse:"",
   telephone:"",
   mail:"",
   photo:""
}

export default function Person() {
   const [state,setState] = useState(initialState);

   const {nom,adresse,telephone,mail,photo} = state;

   // const [photos, setPhotos] = useState('');

   //  const [lastId, setLastId] = useState({
   //    numero: "",
   //  });

   //  useEffect(() => {
   //    getlastPersonne();
   //  }, []);

   //  function getlastPersonne() {
   //    axios.get("http://localhost:8000/lastId").then(function (response) {
   //      if (response.status === 200) {
   //        setLastId(response.data);
   //      } else {
   //        toast.warning("Vous n'êtes pas autorisé à accéder à cette page!");
   //      }
   //    });
   //  }

   //  const handlePicturePhoto = (event) => {
   //    console.log(event.target.files);
   //    setPhotos(event.target.files[0]);

   //    //  setPhotos({
   //    //    ...photos,
   //    //    file: event.target.files[0],
   //    //    filepreview: URL.createObjectURL(event.target.files[0]),
   //    //  });
   //  };

   // const ajoutImage = async () => {
   //    const formdata = new FormData();
   //    formdata.append("photo", photos.file);
   //    const numeroAnticiper = lastId.numero;
   //    axios
   //      .put("http://localhost:8000/image" + numeroAnticiper, formdata, {
   //        headers: { "Content-Type": "multipart/form-data" },
   //      })
   //      .then((res) => {
   //        if (res.data.success) {
   //          toast.success("Compte creer avec success.");
   //        }
   //      });
   //  };

   const handleSubmit = (e) => {
      e.preventDefault();
      if(!nom || !adresse || !telephone || !mail || !photo){
         alert("Nom:"+nom+"adr:"+adresse+"tel:"+telephone+"mail:"+mail+"photo:"+photo);
         toast.error("Please provide value into each input field")
      }
      else{
         axios.post("http://localhost:8000/add",{  
            nom,
            adresse,
            telephone,
            mail,
            photo
         }).then(()=>{
            setState({nom:"",adresse:"",telephone:"",mail:"",photo:""});
            alert("Ajout réussi!")
         }).catch((err) => alert(err.response.data));
      }
   }

   const handleInputChange = (e) => {
      const {name,value} = e.target;
      setState({...state, [name]:value});
   }

   return (
   <>
      <Context/>
      <h5 style={{marginTop:"20px"}} class="">Ajout d'une information à propos d'une personne</h5>
      <div style={{marginTop:"20px"}}>
         <form style={{
            margin:"auto",
            padding:"15px",
            maxWidth:"500px",
            alignContent:"center"
         }}
         onSubmit={handleSubmit}
         >
            <input
               type="text"
               id="nom"
               name="nom"
               placeholder="Votre nom"
               value={nom}
               onChange={handleInputChange}
            />

            <input
               type="text"
               id="adresse"
               name="adresse"
               placeholder="Votre adresse"
               value={adresse}
               onChange={handleInputChange}
            />

            <input
               type="number"
               id="telephone"
               name="telephone"
               placeholder="Votre numéro de téléphone"
               value={telephone}
               onChange={handleInputChange}
            />

            <input
               type="email"
               id="mail"
               name="mail"
               placeholder="Votre adresse e-mail"
               value={mail}
               onChange={handleInputChange}
            />

            <input 
               type="file" 
               name="photo" 
               class="form-control"
               onChange={handleInputChange}
               // value={photo}
               />

            <input type="submit" value="Enregistrer"/>
         </form>   
      </div>
   </>
   );
}
