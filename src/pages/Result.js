import React, { useEffect, useState } from 'react'
import {useLocation} from "react-router-dom"
import axios from "axios"
import styled from "styled-components"
import MapIcon from '@mui/icons-material/Map';

const Wrapper=styled.div`
width: 100vw;
height: 100vh;
background-color: lightblue;
display: flex;
justify-content: center;
align-items: center;
`
const Card=styled.div`
width: 1200px;
height: 600px;
background-color: white;
display: flex;
flex-direction: column;
justify-content: space-around;
align-items: flex-start;
border-radius: 10px;
box-shadow: -4px 4px 18px -1px rgba(0,0,0,0.75);
`
const ItemContainer=styled.div`
display: flex;
flex-wrap: wrap;
`
const ItemWrapper=styled.div`
margin: 10px;
padding: 5px;
display: flex;
justify-content: center;
align-items: center;
`
const ItemTitle=styled.span`
font-size: 2em;
font-weight: 500;
margin-right: 10px;
`
const ItemValue=styled.span`
font-size: 2em;
font-weight: 500;
opacity: 0.7;
border: 1px solid black;
padding: 5px;
border-radius: 5px;
`
const Image=styled.img`
width: 200px;
height: 100px;
object-fit: cover;
`
const Link=styled.a`

`
const Video=styled.video`
width: 200px;
height: 100px;
`

function Result() {
  const location=useLocation()
  const randomProductId=location.pathname.split('/')[1]
  const [item,setItem]=useState({})
  
  useEffect(()=>{
      const fetchProduct= async()=>{
       try{
        const res=await axios.get(`https://rohit-ravikiran.herokuapp.com/api/randomProduct/find/${randomProductId}`)
        setItem(res.data)
    }catch(err){
        console.log(err)
    }  
    }
   fetchProduct()   
  },[randomProductId])

  return (
    <Wrapper>
      <Card>
        <ItemContainer>
            <ItemWrapper>
            <ItemTitle>locationName</ItemTitle>
            <ItemValue>{item.locationName}</ItemValue>
            </ItemWrapper>
            <ItemWrapper>
            <ItemTitle>googleMapLink</ItemTitle>
            <Link href={item.googleMapLink}><MapIcon/></Link>
            </ItemWrapper>
            <ItemWrapper>
            <ItemTitle>address</ItemTitle>
            <ItemValue>{item.address}</ItemValue>
            </ItemWrapper>
        </ItemContainer>
        <ItemContainer>

        <ItemWrapper>
            <ItemTitle>description</ItemTitle>
            <ItemValue>{item.description}</ItemValue>
            </ItemWrapper>
            <ItemWrapper>
            <ItemTitle>emailId</ItemTitle>
            <ItemValue>{item.emailId}</ItemValue>
            </ItemWrapper>
            <ItemWrapper>
            <ItemTitle>emailBody</ItemTitle>
            <ItemValue>{item.emailBody}</ItemValue>
            </ItemWrapper>
        </ItemContainer>

        <ItemContainer>
            <ItemWrapper>
                <ItemTitle>mediaType</ItemTitle>
                <ItemValue>{item.mediaType}</ItemValue>
                </ItemWrapper>
            <ItemWrapper>
            
            {item.mediaType==="audio" && <audio controls>
              <source src={item.mediaLink} type="audio/mp3"/>
            </audio>}
            {item.mediaType==="image" && <Image src={item.mediaLink}/>}
            {item.mediaType==="video" && <video width="300px" controls>
             <source src={item.mediaLink} type='video/mp4'/>
            </video>}
            </ItemWrapper>
        </ItemContainer>
      </Card>
    </Wrapper>
  )
}

export default Result


//     "locationName": "dlknsdl",
//     "googleMapLink": "sdknfsd",
//     "address": "sdknfsd",

//     "description": "dlfkndlkfnldknndl",
//     "emailId": "test@gmail.com",
//     "emailBody": "body",

//     "mediaType": "image",
//     "mediaLink": "https://firebasestorage.googleapis.com/v0/b/ravikiraninfotech-4efe7.appspot.com/o/165456944601486098ed50a5eea7dd9d756036fe59b0b.jpg?alt=media&token=1909f98f-13fb-4ff0-aba6-226f4a0843eb",
