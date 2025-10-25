import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignUp() {
    const [credentials,setCredentials]=React.useState({name:"",email:"",password:"",geolocation:""});
    const navigate = useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log('Submitting signup', credentials);
        try{
            const response= await fetch('http://localhost:5000/api/createuser', {
                method:'POST',
                headers:{ 'Content-Type':'application/json' },
                body:JSON.stringify({name:credentials.name,email:credentials.email,password:credentials.password,location:credentials.geolocation})
            });
            if(!response.ok){
                const text=await response.text();
                throw new Error(`Server ${response.status}: ${text}`);
            }
            const json = await response.json();
            console.log('Signup response', json);
            // robust extraction of user id / token from multiple possible response shapes
            const token = json?.createdUserId ?? json?.id ?? json?._id ?? json?.userId ?? json?.token ?? json?.authToken ?? json?.user?.id;
            const userName = json?.userName ?? json?.name ?? json?.user?.name ?? credentials.name ?? '';
            if (token) {
                localStorage.setItem('userToken', token);
                localStorage.setItem('userName', userName);
                localStorage.setItem('welcomeSeen', '1');
                window.dispatchEvent(new Event('authChange'));
                navigate('/');
                alert('Sign Up Successful');
                return;
            }
            // fallback when no token but server returned success flag
            if (json?.success) {
                alert('Sign Up succeeded but no token returned from server. Please login.');
                navigate('/login');
                return;
            }
            alert('Sign Up Failed');
        }catch(err){
            console.error('Signup fetch error',err);
            alert('Failed to submit signup: '+err.message);
        }
    }
    const onChange=(event)=>{
        setCredentials({...credentials,[event.target.name]:event.target.value})
    }
  return (
    <>
        <div style={{ minHeight: '100vh',width: '100%',display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '24px',
                backgroundImage:' url(https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg)',
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} >
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '520px', background: 'rgba(147, 126, 126, 0.67)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.45)',
                borderRadius: '16px', boxShadow: '0 12px 30px rgba(230, 192, 192, 0.68)', padding: '28px 24px', color: '#ffffffff' }} >
                <div style={{textAlign:'center', marginBottom: 12}}>
                    <h2 style={{margin:0, fontWeight: 800, color: '#06500bff'}}>Create your account</h2>
                    <p style={{margin:0, marginTop: 6, color:'#0bcefff8'}}>Join FoodHub and start exploring tasty dishes</p>
                </div>
          <div className="mb-3">
           <label htmlFor="exampleInputName" className="form-label">Name</label>
              <input type="text" className="form-control" name='name' value={credentials.name} onChange={onChange} style={{ background:'#ffffff', color:'#263238', border:'1px solid #e0e0e0', borderRadius:10, padding:'10px' }}/>
            </div> 
          <div className="mb-3">
           <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} style={{ background:'#ffffff', color:'#263238', border:'1px solid #e0e0e0', borderRadius:10, padding:'10px' }} />
        </div>
          <div className="mb-3">
           <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control" name='password' value={credentials.password} onChange={onChange} style={{ background:'#ffffff', color:'#263238', border:'1px solid #e0e0e0', borderRadius:10, padding:'10px' }} />
        </div>
          <div className="mb-3">
           <label htmlFor="exampleInputLocation" className="form-label">Location</label>
              <input type="text" className="form-control"name='geolocation' value={credentials.geolocation} onChange={onChange} style={{ background:'#ffffff', color:'#263238', border:'1px solid #e0e0e0', borderRadius:10, padding:'10px' }} />
                </div>
                <div style={{display:'flex', alignItems:'center', gap: 12, marginTop: 8}}>
                    <button type="submit" className="btn" style={{ background:'#1e88e5',color:'#ffffffff',fontWeight:600,padding:'10px 18px',borderRadius:10 }} >Sign Up </button>
                    <Link className="btn"to="/login"style={{background:'#e53935',color:'#ffffffff',fontWeight:600,padding:'10px 18px',borderRadius:10,justifyContent:'center',display:'flex' }}>Already a User</Link>
                </div>
        </form>
        </div>
    </>
  )
}
