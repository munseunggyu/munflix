import styled from "styled-components";
import { getDetail, getsimilar, getTrailer, IDetail, IGetResult, IMovie, ITrailer } from "../api"
import { makeImagePath } from "../utilts"
import {AiTwotoneStar} from 'react-icons/ai'
import { useQuery } from "react-query";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  display: flex;
  align-items:end;
  div{
    display: flex;
    justify-content:space-between;
    align-items:center;
    width:100%;
    h3{
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 30px;
    }
   span{
    display: flex;
    align-items:center;
    padding-right:20px;
    p{
      margin-top:2px;
      margin-left:5px;
    }
  }
    
  }
`;
const BigOverview = styled.div`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;
const BigOverviewTitle = styled.div`
  padding:20px;
  display: flex;
  align-items:center;
  margin-bottom:-15px;
  h5{
    font-size:20px;
    font-weight:600;
    margin-right:10px;
  }
`;
const RunningTime = styled.span`
  border-radius:5px;
  background-color:#FBC530;
  color: ${(props) => props.theme.white.lighter};
  padding:5px;
  font-weight:500;
  margin-right:10px;
`;
const TrailerContainer = styled.div`
  z-index:5;
  width:100%;
  height:100%;
`;
const YoutubeToggleBtn = styled.button`
  border-radius:5px;
  background-color:#FBC530;
  color: ${(props) => props.theme.white.lighter};
  padding:5px;
  font-weight:500;
  background-color:red;
  outline:none;
  cursor: pointer;
  border:0;
`;
const GenresTagContainer = styled.div`
  padding:20px;
  display: flex;
`
const GenresTag = styled.span`
  border-radius:5px;
  font-weight:500;
  padding:5px;
  background-color:#808080;
  margin-right:5px;
  color: ${(props) => props.theme.white.lighter};
`;
const SimilarContentsTitle = styled.h3`
  padding:20px;
  font-weight:600;
`
const SimilarContentsContainer = styled.div`
  padding:20px;
  display: grid;
  grid-template-columns:0.5fr 0.5fr;
  gap:5px;
  place-items: center;
  img{
    border-radius:5px;
    width: 100%;
    margin:0 auto;
    height:200px;
  }
`;

function BigScreen({clickedMovie,type}:{clickedMovie:IMovie,type:string}){
  const {data} = useQuery<IDetail>(['movies'],() => getDetail(type,clickedMovie.id))
  const similar = useQuery<IGetResult>(['similar'],() => getsimilar(type,clickedMovie.id))
  const similarData = similar.data?.results.slice(0,6)
  const trailer = useQuery<ITrailer>(['trailar'],() => getTrailer(type,clickedMovie.id))
  let [youtubeToggle,setYoutubeToggle] = useState(false)
  let [youtube,setYoutube] = useState('')
  const onYoutubeToggle = () => {
    setYoutubeToggle(prev => !prev)
    if(trailer.data?.results.length !== 0){
      setYoutube(`https://www.youtube.com/watch?v=${trailer.data?.results[0].key}`)
    }else{
      alert('트레일러가 없습니다')
    }
  }
  return(
    <>
      <BigCover 
      style={{
        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
          clickedMovie.backdrop_path,
          "w500"
        )})`,
      }}
      > 
      { youtubeToggle
      ? <TrailerContainer>
          <ReactPlayer url={youtube || undefined } width="100%" height='100%' />
      </TrailerContainer>
       : 
       <div>
        <h3>{clickedMovie.title ? clickedMovie.title : clickedMovie.name}</h3>
        <span> <AiTwotoneStar color="RGB(251, 160, 0)" /> <p>{clickedMovie.vote_average}</p></span>
      </div>
       }
      </BigCover>
      
      <BigOverviewTitle>
        <h5>
          {data?.release_date ? data.release_date.slice(0,4) : data?.first_air_date.slice(0,4)}
        </h5>
        { data?.runtime &&
          <RunningTime>{data?.runtime}분</RunningTime>
        }
          <YoutubeToggleBtn onClick={onYoutubeToggle} >Youtube</YoutubeToggleBtn> 
      </BigOverviewTitle>
      <GenresTagContainer>
        {
          data?.genres.map(item => <GenresTag>{item.name}</GenresTag>)
        }
      </GenresTagContainer>
      <BigOverview>{
      clickedMovie.overview
      ? clickedMovie.overview.slice(0,300)
      : null}...</BigOverview> 
      <SimilarContentsTitle>비슷한 콘텐츠</SimilarContentsTitle>
      <SimilarContentsContainer>
      {
        similarData?.map((similar,i) => <img key={similar.id+i} src={makeImagePath(similar.backdrop_path)} />)
        
      }
      </SimilarContentsContainer>
    </>
  )
}
export default BigScreen