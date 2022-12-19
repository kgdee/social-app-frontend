import "./Share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from '../../axios'
import avatar from '../../assets/avatarRounded.png'

const Share = () => {
  const [file, setFile] = useState(null)
  const [desc, setDesc] = useState('')
  const { currentUser } = useContext(AuthContext)

  const queryClient = useQueryClient()

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post('/posts', newPost)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts'])
      }
    }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    let imgUrl = ''
    if (file) imgUrl = "/uploads/" + await upload()

    mutation.mutate({ desc, img: imgUrl })

    setDesc('')
    setFile(null)
  }

  const upload = async () => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await makeRequest.post('/upload', formData)
      return res.data
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="share">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="top">
            <div className="left">
              <img src={currentUser.profilePic ? currentUser.profilePic : avatar} alt="" />
              <input
                type="text"
                placeholder={`What's on your mind ${currentUser.name}?`}
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
              />
            </div>
            <div className="right">
              {file && (
                <img className="file" alt="" src={URL.createObjectURL(file)} />
              )}
            </div>
          </div>
          <hr />
          <div className="bottom">
            <div className="left">
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="file">
                <div className="item">
                  <img src={Image} alt="" />
                  <span>Add Image</span>
                </div>
              </label>
              <div className="item">
                <img src={Map} alt="" />
                <span>Add Place</span>
              </div>
              <div className="item">
                <img src={Friend} alt="" />
                <span>Tag Friends</span>
              </div>
            </div>
            <div className="right">
              <button>Share</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Share;