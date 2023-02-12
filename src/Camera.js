import React, {useRef, useState} from 'react'
import Webcam from 'react-webcam'
import 'bootstrap/dist/css/bootstrap.min.css'
import Context from "./Context";
import './Camera.css'
import { BiCamera } from "react-icons/bi";
import { IoReloadSharp } from "react-icons/io5";
import { IoCloudUploadOutline } from "react-icons/io5";
import {saveAs} from "file-saver";
import axios from 'axios'
import { BiAnalyse } from "react-icons/bi";



const videoConstraints = {
    width:400,
    facingMode:'environment'
}



const Camera = () => {
    const webcamRef = useRef(null)
    const [url,setUrl] = useState(null)
    const [verifier,setVerifier] = useState("none")
    const [showBtn,setShowBtn] = useState(false)
    const inputRef = useRef()
    const [selectedfile, setFiles] = useState(null)
    const [showCheck,setCheck] = useState(false)
    const [pers,setPers]=useState([])

    const [answer,setAnswer] = useState(null)

    const downloadPhoto = ()=>{
        let url1 = url
        saveAs(url1, "comparer");
        setCheck(true)
    }

    const capturePhoto = React.useCallback(async() => {
        const imageSrc = webcamRef.current.getScreenshot()
        setUrl(imageSrc)
        setShowBtn(true)
        
    },[webcamRef])

    const onUserMedia = (e) => {
        console.log(e);
    }

    const handlePhoto = (e) => {
        const selectedFiles = inputRef.current.files[0];
        var data = new FormData();
        data.append('file', selectedFiles);
        setFiles(inputRef.current.files[0])
     }


    const checkPhoto = () =>{
        // Create an object of formData
        setVerifier("inline");
        setCheck(false)
        setShowBtn(false)
        
        const photo = new FormData();
     
        // // Update the formData object
        photo.append(
            "photo",
            selectedfile,
            selectedfile.name
        );

        axios.put("http://localhost:8000/check",photo).then((response)=>{
            if(response.data == "Inconnu"){
                setAnswer(response.data)
                setVerifier("none")
                setCheck(false)
                setShowBtn(false)
            }
            else{
                axios.get("http://localhost:8000/about/"+response.data).then(function (res) {
                    setPers(res.data); 
                   // alert(JSON.stringify(pers.id));
                    setAnswer(response.data)
                    setVerifier("none")
                    setCheck(false)
                    setShowBtn(false)
                });                
            }
            
            // alert(JSON.stringify(response))
        }).catch((err) => alert(JSON.stringify(err)));
    }

    return(
        <>
            <Context/>
            <div  class="contentCamera">
                <div class="texte">
                    <h2 class='dans'>ÊTES-<strong>VOUS</strong></h2>
                    <h2 id='base'>DANS LA BASE ? </h2>
                        <p>Prenez une photo pour vérifier.</p>
                </div>
                <div class="camera">
                    <div id="camera2">
                    {
                        url && (
                        <div id='sary1'>
                             <div id='scan1' style={{
                                display:verifier,
                             }}>

                            </div>
                            <div class="appareilPhoto">
                                <img src={url} alt="Screenshot"/>
                            </div>
                            <div id='boutonCapturer'onClick={()=>{setUrl(null)
                            setShowBtn(false)
                            setAnswer(null)
                        
                        }
                            }>
                                <IoReloadSharp style={{marginRight:'10px'}} size={20}/>
                                Reprendre
                            </div>
                            
                        </div>  
                        )
                    }
                    {
                        !url && (
                        <div id='sary1'>
                            <div class="appareilPhoto">
                                <Webcam 
                                    ref={webcamRef}
                                    audio={false}
                                    screenshotFormat="image/png"
                                    videoConstraints={videoConstraints}
                                    onUserMedia={onUserMedia}
                                    mirrored= {true}
                                />
                            </div>
                            <div id='boutonCapturer' onClick={()=>capturePhoto()}>
                                <BiCamera style={{marginRight:'10px'}} size={20}/>
                                Capturer
                            </div>
                        </div>  
                        )
                    }
                    
                     {
                        showBtn && (
                            <div id='boutonCapturer1' onClick={()=>{downloadPhoto()}}>
                            <IoCloudUploadOutline style={{marginRight:'10px'}} size={20}/>
                            Enregistrer
                            </div>
                        )
                    }
                    </div>
                    <div id='reponse' >
                    <div class="misysoratra" style={{
                                display:verifier,
                             }}>
                        <div class="typewriter">En cours de traitement...</div>
                    </div>
                        {
                            showCheck && (
                                <div style={{width:'100%',marginTop:'35px'}}>
                                <input 
                                    style={{
                                        border:'1px solid rgb(34, 33, 34)',
                                        backgroundColor:'black'
                                    }}
                                    type="file" 
                                    name="photo" 
                                    id="photo"
                                    class="form-control input"
                                    onChange={handlePhoto}
                                    ref={inputRef}
                                    required
                                    />

                                <div id='boutonCorre' onClick={()=>{checkPhoto()}}>
                                    <BiAnalyse style={{marginRight:'10px'}} size={20}/>
                                    Chercher une correspondance
                                </div>
                            </div>
                    
                            )
                        }

                        {
                            answer && answer=="Inconnu" && (
                                <div id='inconnu'>
                                    Oops... <br></br>
                                   Nous n'avons trouvé aucune correspondance. Vous pouvez réessayer avec une autre image.
                                </div>
                            )
                        }

                        {
                            answer && answer!="Inconnu" && (
                                <div id='trouve'>
                                   <p>Fa tsy i {pers.nom} ve ity e, sa... ?</p>
                                    <div id='info'>
                                        <div id='imgTrouve'>
                                            <img  src ={require('../../backend/Images/'+pers.photo)} alt={pers.nom}/>
                                        </div>
                                        <div style={{marginTop:'15px'}}>
                                        <p>Nom : <b>{pers.nom}</b></p>
                                        <p>Tel : {pers.telephone}</p>
                                        </div>
                                    </div>  
                                    
                                </div>
                                
                            )
                        }
                    
                  
                    </div>
                </div>
                {/* <div class="appareil">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-info">Prendre une photo</h3>
                        </div>

                        <div class="card-body">
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/png"
                                videoConstraints={videoConstraints}
                                onUserMedia={onUserMedia}
                                mirrored= {true}
                            />
                        </div>

                        <div class="card-footer">
                            <button class="btn btn-success" onClick={capturePhoto}>Capturer</button>
                            <button class="btn btn-danger" onClick={()=>setUrl(null)}>Actualiser</button>
                        </div>
                    </div>
                    {url && (
                        <div class="card">
                            <div class="card-header">
                                <h3 class="text-info">Photo capturee</h3>
                            </div>

                            <div class="card-body">
                                <img src={url} alt="Screenshot"/>
                            </div>

                            <div class="card-footer">
                                <input type="file" name="photo" class="form-control"/>
                                <button class="btn btn-info">Envoyer</button>
                            </div>  
                        </div>  
                    )}
                </div> */}

            </div>

            {/* <div class="row">
                <div class="col">
                </div>

                <div class="col">
                    
                </div>

                <div class="col">
                </div>
            </div>             */}
        </>
    )
}

export default Camera;