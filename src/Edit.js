import React, { useEffect, useState } from 'react'
import './Person.css'
import axios from 'axios'
import Context from "./Context";
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';


const initialState = {
   nom:"",
   adresse:"",
   telephone:"",
   mail:""
}

export default function Edit() {
   const navigate = useNavigate();

   const [state,setState] = useState(initialState);

   const {nom,adresse,telephone,mail} = state;

   const {id} = useParams();

   useEffect(() => {
        axios
        .get("http://localhost:8000/about/"+id)
        .then((res) => setState({...res.data}));
   },[id])

   const handleSubmit = (e) => {
      e.preventDefault();
      if(!nom || !adresse || !telephone || !mail){
         toast.error("Please provide value into each input field")
      }
      else{
         axios.put("http://localhost:8000/edit/"+id,{   
            nom,
            adresse,
            telephone,
            mail
         }).then(()=>{
            setState({nom:"",adresse:"",telephone:"",mail:""});
            alert("Modification réussi!")
            navigate("/liste");
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
      <h5 style={{marginTop:"20px"}} class="">Modification d'une information à propos d'une personne</h5>
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
               value={nom || ""}
               onChange={handleInputChange}
            />

            <input
               type="text"
               id="adresse"
               name="adresse"
               placeholder="Votre adresse"
               value={adresse || ""}
               onChange={handleInputChange}
            />

            <input
               type="number"
               id="telephone"
               name="telephone"
               placeholder="Votre numéro de téléphone"
               value={telephone || ""}
               onChange={handleInputChange}
            />

            <input
               type="email"
               id="mail"
               name="mail"
               placeholder="Votre adresse e-mail"
               value={mail || ""}
               onChange={handleInputChange}
            />

            <input type="submit" value="Modifier"/>
         </form>   
      </div>
   </>
   );
}
