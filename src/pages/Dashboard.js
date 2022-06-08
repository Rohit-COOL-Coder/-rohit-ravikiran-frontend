import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { DateRange } from 'react-date-range'
import {format} from "date-fns"
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import app from '../firebase'
import{ getStorage,ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import axios from "axios"
import {useNavigate} from "react-router-dom"

const Wrapper=styled.div`
width: 100vw;
height: 100vh;
background-image: linear-gradient(to right,rgb(36, 47, 155) ,rgb(100, 111, 212));
`
const Container=styled.div`
width: inherit;
height: inherit;
display: flex;
justify-content: center;
align-items: center;

`
const Card=styled.div`
padding: 10px 40px 30px 40px;
background-color: white;
border-radius: 10px;
box-shadow: -4px 4px 18px -1px rgba(0,0,0,0.75);
position: relative;
border: 1px solid black;
`
const CardContainer=styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`
const Top=styled.div`
display: flex;
flex:1;
`
const Title=styled.h1`
font-size: 30px;
font-weight: 600;
opacity: 0.7;
letter-spacing: 2px;
margin-top: 30px;
color: rgb(36, 47, 155);
`

const Bottom=styled.div`
margin-top: 10px;
display: flex;
flex:4;
display: flex;
flex-direction: column;
`
const BottomContainer=styled.div`
display: flex;
margin-top: 10px;
`
const ItemContainer=styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`
const ItemName=styled.span`
opacity: 0.7;
font-weight: 500;
`
const Input=styled.input`
padding: 10px 20px;
margin: 10px;
font-size: 15px;
border: none;
background-color: rgb(246, 251, 244);
outline: none;
border-radius: 5px;
border: 1px solid rgb(238, 238, 238);
opacity: 0.7;
font-weight: 500;
`

const Button=styled.button`
padding: 12px 88px;
margin-left: 10px;
font-size: 15px;
color: white;
background-color: rgb(36, 47, 155);
border: none;
border-radius: 5px;
cursor: pointer;
opacity: 0.8;
transition: all 0.5s ease;
&:hover{
    opacity: 1;
}
`
const RadioContainer=styled.div`
display: flex;
justify-content: center;
align-items: center;
opacity: 0.7;
`
const Address=styled.textarea`
margin-left: 8px;
margin-right: 10px;
font-size: 15px;
padding-left: 20px;
padding-top: 5px;
opacity: 0.7;
font-weight: 500;

border: none;
background-color: rgb(246, 251, 244);
outline: none;
border-radius: 5px;
border: 1px solid rgb(238, 238, 238);
`
const CalenderDate=styled.span`
padding: 10px;
margin-left: 13px;
cursor: pointer;
width: 200px;
font-size: 15px;
border: none;
background-color: rgb(246, 251, 244);
outline: none;
border-radius: 5px;
border: 1px solid rgb(238, 238, 238);
opacity: 0.5;
font-weight: 500;
`
const CalanderUI=styled.div`
position: absolute;
right: -360px;
top: 0px;
`
const File=styled.input`
margin-left: 27px;
font-size: 15px;
opacity: 0.7;
font-weight: 500;
width: 200px;
`
const Error=styled.span`
color: rgb(242, 76, 76);
font-size: 12px;
`
const ProgressBar=styled.div`
width: 200px;
position: absolute;
bottom: 10px;
right: 10px;
`

function Dashboard() {
    const navigate=useNavigate()

    const initialValue={
      locationName: "",
      googleMapLink: "",
      address: "",
      mediaType: "",
      description: "",
      emailId: "",
      emailBody: ""
  }
    const [fieldValues,setFieldsValues]=useState(initialValue)
    const [fieldError,setFieldError]=useState({})
    const [openDate,setOpenDate]=useState(false)
    const [file,setFile]=useState(null)
    const [isSubmit,setIsSubmit]=useState(false)
    const [fileUpload,setFileUpload]=useState(0)
    const [isUploading,setIsUploading]=useState(false)
    const [state, setState] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
      ]);

      // console.log(fieldValues)
    //   console.log(format(state[0].startDate,'MM/dd/yy'))

     useEffect(()=>{
         console.log(fieldError)
         console.log(isSubmit)
         if(Object.keys(fieldError)==0 && isSubmit){
              setIsUploading(true)
              const fileName=new Date().getTime() + file.name
              const storage = getStorage(app);
              const storageRef = ref(storage, fileName);
          
              const uploadTask = uploadBytesResumable(storageRef, file);
          
                    uploadTask.on('state_changed', 
                      (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                          case 'paused':
                            console.log('Upload is paused');
                            break;
                          case 'running':
                            setFileUpload(progress)
                            console.log('Upload is running');

                            break;
                            default:
                        }
                      }, 
                      (error) => {
                        console.log("Handle unsuccessful uploads")
                      }, 
                      () => {
                        getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
                        setIsUploading(false)
                        try{
                          const data=await axios.post('https://rohit-ravikiran.herokuapp.com/api/randomProduct/add',{...fieldValues,mediaLink:downloadURL})
                          
                          navigate(`/${data.data._id}`)
                        }catch(err){
                          console.log(err)
                        }
                        });
                      }
                    );
         }
     },[isSubmit])
      console.log(fileUpload)
      const handleInput=(e)=>{
         setFieldsValues((prev)=>(
             {...prev,[e.target.name]:e.target.value}
         ))
      }

      const handleSubmit= (e)=>{
        e.preventDefault()
        setFieldError(validateForm(fieldValues))
        setIsSubmit(!isSubmit)
  }

  const validateForm=(value)=>{
   const errors={}
   const regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if(!value.locationName){
          errors.locationName="locationName is required"
        }else if(value.locationName.length < 4 || value.locationName.length >20 ){
          errors.locationName="LocationName not valid"
        }
        if(!value.googleMapLink){
          errors.googleMapLink="GoogleMapLink is required"
        }
        if(!value.address){
          errors.address="Address is required"
        }else if(value.address.length <4 || value.address.length >100){
          errors.address="Address not valid"
        }
        if(!value.mediaType){
          errors.mediaType="Please select Media type"
        }
        if(!value.googleMapLink){
        errors.googleMapLink="googleMapLink is required"
        }
        if(!value.emailId){
        errors.emailId="emailId is required"
        }else if(!regex.test(value.emailId)){
          errors.emailId="invalid email format"
        }
        if(!value.description){
          errors.description="Description is required"
          }else if(value.description.length <4){
            errors.description="Email subject must be greater then 4 charecter"
          }
        if(!value.emailBody){
          errors.emailBody="emailBody is required"
        }else if(value.emailBody.length <20){
          errors.emailBody="Email body must be greater then 20 charecter"
        }if(file==null){
           errors.mediaLink="Select file"
        }else if(file?.type.split('/')[0]!=fieldValues.mediaType){
          errors.mediaLink="select the correct file "
        }
  return errors
  }

  return (
    
    <Wrapper>
      {isUploading && <ProgressBar className="progress">
         <div className="progress-bar" role="progressbar" style={{width: `${fileUpload}%`}} ></div>
      </ProgressBar>}
       <Container>
       
           <Card>
               <CardContainer>
                   <Top>
                       <Title>Ravikiran Infotech</Title>
                   </Top>
                   <Bottom>

                       <BottomContainer>
                           <ItemContainer>
                           <Input placeholder='Location Name' name="locationName" onChange={handleInput}/>
                           {fieldError.locationName && <Error>{fieldError.locationName}</Error>}
                           </ItemContainer>
                           <ItemContainer>
                           <Input placeholder='Google Map Link' name="googleMapLink" onChange={handleInput}/>
                           {fieldError.googleMapLink && <Error>{fieldError.googleMapLink}</Error>}
                           </ItemContainer>
                       </BottomContainer>

                       <BottomContainer>
                           <ItemContainer>
                           <Address rows="4" cols="23" placeholder='Address' name="address" onChange={handleInput}/>
                           {fieldError.address && <Error>{fieldError.address}</Error>}
                           </ItemContainer>
                           <ItemContainer>
                           <CalenderDate onClick={()=>setOpenDate(!openDate)} >{`${format(state[0].startDate,'MM/dd/yy')} TO ${format(state[0].endDate,'MM/dd/yy')}`}</CalenderDate>
                           <CalanderUI>
                           {openDate && <DateRange
                                editableDateInputs={true}
                                onChange={item => setState([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={state}
                                />}
                                </CalanderUI>
                           </ItemContainer>
                       </BottomContainer>

                       <BottomContainer>
                           <ItemContainer>
                           <ItemName>Media Type</ItemName>
                               <RadioContainer name="mediaType" onChange={handleInput}>
                               <Input  type="radio" id="html" name="mediaType" value="audio"/>
                                <ItemName>Audio</ItemName>
                                <Input type="radio" id="css" name="mediaType" value="image"/>
                                <ItemName >Image</ItemName>
                                <Input type="radio" id="javascript" name="mediaType" value="video"/>
                                <ItemName >Video</ItemName>
                               </RadioContainer>
                               {fieldError.mediaType && <Error>{fieldError.mediaType}</Error>}
                               
                           </ItemContainer>
                           <ItemContainer>
                           <File type="file" onChange={(e)=>setFile(e.target.files[0])}/>
                           {fieldError.mediaLink && <Error>{fieldError.mediaLink}</Error>}
                           </ItemContainer>
                       </BottomContainer>

                       <BottomContainer>
                           <ItemContainer>
                           <Input placeholder='Description' name="description" onChange={handleInput}/>
                           {fieldError.description && <Error>{fieldError.description}</Error>}
                           </ItemContainer>
                           <ItemContainer>
                           <Input placeholder='Email ID' name="emailId" onChange={handleInput}/>
                           {fieldError.emailId && <Error>{fieldError.emailId}</Error>}
                           </ItemContainer>
                       </BottomContainer>

                       <BottomContainer>
                       <ItemContainer>
                           <Input placeholder='Email body' name="emailBody" onChange={handleInput}/>
                           {fieldError.emailBody && <Error>{fieldError.emailBody}</Error>}
                           </ItemContainer>
                           <ItemContainer>
                           <Button onClick={handleSubmit}>Submit</Button>
                           </ItemContainer>
                           
                       </BottomContainer>
                   </Bottom>
               </CardContainer>
           </Card>
       </Container>
    </Wrapper>
  )
}

export default Dashboard

// Location name
// google Map Link (user will enter url)

// Address
// from date  -  to Date (Date fields)

// Media Type (audio /image/video) (radio buttons)
// Media upload (depending on media type selected)[ audio upload, image
// upload, video link]

// Description [Rich Text format]
// Email ID :
// Email body [ Rich Text]