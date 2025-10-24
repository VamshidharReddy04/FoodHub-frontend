import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
export default function Login() {
    const navigate = useNavigate();
  const [credentials,setCredentials]=useState({email:"",password:""});
      const handleSubmit=async(e)=>{
          e.preventDefault();
          console.log('Submitting login', credentials);
          try{
              const response= await fetch('http://localhost:5000/api/login', {
              method:'POST',
              headers:{
                  'Content-Type':'application/json'
              },
              body:JSON.stringify({email:credentials.email,password:credentials.password})
          });
          if(!response.ok){
              const text=await response.text();
              throw new Error(`Server ${response.status}: ${text}`);
          }
          const json=await response.json();
          console.log('Login response', json);
          if(json.success){
              alert('Login Successful');
                localStorage.setItem('authToken',json.authToken);
                console.log(localStorage.getItem('authToken'));
                localStorage.setItem('userToken', json.id || json._id || json.token);
                localStorage.setItem('userName', json.name || '');
                localStorage.setItem('welcomeSeen', '1'); // optional: hide welcome popup after login
                // notify Navbar to re-render
                window.dispatchEvent(new Event('authChange'));
              navigate("/");
          }else{
              alert('Login Failed');
          }
          }catch(err){
              console.error('Login fetch error',err);
              alert('Failed to submit login: '+err.message);
          }
      }
      const onChange=(event)=>{
          setCredentials({...credentials,[event.target.name]:event.target.value})
      }
  return (
    <>
        <div style={{minHeight: '100vh',width: '100%',display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '24px',position: 'relative',overflow: 'hidden',backgroundImage:    'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg)',backgroundSize: 'cover',backgroundPosition: 'center',backgroundRepeat: 'no-repeat'}}>
            <div style={{position: 'absolute',top: -120,bottom: -140,left: -120,right: -100,width: 340,height: 340,background: 'radial-gradient(circle at center, rgba(255,255,255,0.22), rgba(255,255,255,0) 60%)',filter: 'blur(2px)',zIndex: 0}}/>
            <div style={{position: 'absolute',inset: 0,boxShadow: 'inset 0 0 160px rgba(0,0,0,0.35)',pointerEvents: 'none',zIndex: 0}}/>
            <form onSubmit={handleSubmit} style={{width: '100%',maxWidth: '480px',background: 'rgba(255, 255, 255, 0)',backdropFilter: 'blur(6px)',WebkitBackdropFilter: 'blur(6px)',border: '1px solid rgba(255,255,255,0.45)',borderRadius: '16px',boxShadow: '0 12px 30px rgba(0,0,0,0.18)',padding: '28px 24px',zIndex: 1,color: '#feffffff' }}>
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <h2 style={{ margin: 0, fontWeight: 800, color: '#31e73da2' }}>Welcome FoodHub</h2>
                    <p style={{ margin: 0, marginTop: 6, color: '#d9c82fd8' }}>Log in to continue exploring</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} style={{ background:'#ffffff', color:'#263238', border:'1px solid #e0e0e0', borderRadius: 10, padding: '10px' }}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" name='password' value={credentials.password} onChange={onChange} style={{ background:'#ffffff', color:'#263238', border:'1px solid #e0e0e0', borderRadius: 10, padding: '10px' }}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                    <button type="submit" className="btn" style={{background: '#1e88e5',color: '#fff',fontWeight: 600,padding: '10px 18px',borderRadius: 10}}>Login</button>
                    <Link className="btn" to="/createuser" style={{ background: '#e53935', color: '#fff', fontWeight: 600, padding: '10px 18px', borderRadius: 10 }}>  New User</Link>
                </div>
            </form>
        </div>
    </>
  )
}
