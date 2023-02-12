import React, { useEffect, useState } from 'react'
import './About.css'
import axios from 'axios'
import Context from "./Context";
// import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';


const initialState = {
   nom:"",
   adresse:"",
   telephone:"",
   mail:"",
}

export default function About() {
   const navigate = useNavigate();

   const [state,setState] = useState(initialState);

   const {nom,adresse,telephone,mail,photo} = state;

   const {id} = useParams();

   const [images, setPhoto] = useState(null);

   useEffect(() => {
        axios
        .get("http://localhost:8000/about/"+id)
        .then((res) => setState({...res.data}));
   },[id])

   const handlePicturePhoto = (event) => {
    setPhoto(event.target.files[0]);
    console.log(event.target.files[0]);
  };

   const handleSubmit = (e) => {
      e.preventDefault();
        const formdata = new FormData();
        formdata.append("photo", images, images.file);
        axios
        .put("http://localhost:8000/image/"+id, formdata, {
          headers: { "Content-Type": "multipart/form-data" },
        }).then(()=>{
            alert("Mis à jour réussie!");
            navigate("/liste");
         }).catch((err) => alert(err.response.data));
   }

   return (
   <>
      <Context/>
      <div class="contentAbout">
         <div id='sary'>
            {/* <img  src ={require('../../backend/Images/'+photo)} alt={nom}/> */}
         </div>
         <div id='details'>

         </div>

        <div className="c card">
            <div className="card-header">
                <h5 class="">A propos de {nom || ""}</h5>
            </div>

            <div style = {{textAlign:"justify"}} className="card-body">
                <div className='row'>
                    <div className='col'>
                        <p><span style={{fontWeight:"bold"}}>Nom: </span><span style={{fontStyle:"italic"}}>{nom || ""}</span></p>   
                        <p><span style={{fontWeight:"bold"}}>Adresse: </span><span style={{fontStyle:"italic"}}>{adresse || ""}</span></p>   
                        <p><span style={{fontWeight:"bold"}}>Téléphone: </span><span style={{fontStyle:"italic"}}>{telephone || ""}</span></p>   
                        <p><span style={{fontWeight:"bold"}}>E-mail: </span><span style={{fontStyle:"italic"}}>{ mail || ""}</span></p> 
                        <p><span style={{fontWeight:"bold"}}>Photo: </span><span style={{fontStyle:"italic"}}>{ photo || ""}</span></p> 
                    </div>

                    <div className='col'>
                        <img src={photo} alt={nom} width="400"/>
                    </div>
                </div>  
            </div>
        </div>

        <h6 style={{marginTop:"20px"}}>Mettre à jour la photo</h6>
         <form style={{
            margin:"auto",
            padding:"15px",
            maxWidth:"500px",
            alignContent:"center"
         }}
         onSubmit={handleSubmit}
         >
            <input
               type="file"
               id="photo"
               name="photo"
               onChange={handlePicturePhoto}
            />

            <input type="submit" value="Mettre à jour la photo"/>
         </form>   
      </div>
   </>
   );
}
