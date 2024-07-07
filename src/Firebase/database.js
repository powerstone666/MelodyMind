import { auth} from "./firebaseConfig";
import {db,timestamp} from "./firebaseConfig";
import { getDoc, getDocs,collection, doc, addDoc,deleteDoc,query,where,serverTimestamp } from "firebase/firestore";

const songsReference=collection(db,'likedSongs');

export const fetchUser = async () => {
    try {
     const localUser = JSON.parse(localStorage.getItem("Users"));
             if(localUser){
           
            const q = query(songsReference, where('userId', '==',localUser.uid));
            const data = await getDocs(q);
            
            const mappedDocs = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }));
            
            return mappedDocs;
             }
    } catch (error) {
        console.error('Error fetching user:', error);
        return [];
    }
};



export const addLikes = async (songId,songName,songImage,songYear,userid) => {
    try {
        await addDoc(songsReference, {songId:songId,songName:songName,songUrl:songImage,songYear:songYear,userId:userid});
    } catch (error) {
        console.error('Error adding like:', error);
    }
}

export const deleteLikes = async (id) => {
    try {
        await deleteDoc(doc(db, "likedSongs", id));
    } catch (error) {
        console.error('Error deleting like:', error);
    }
}

const songsReference2=collection(db,'recentSongs');
export const fetchHistory = async () => {
    try {
     const localUser = JSON.parse(localStorage.getItem("Users"));
             if(localUser){
           
            const q = query(songsReference2, where('userId', '==',localUser.uid));
            const data = await getDocs(q);
            
            const mappedDocs = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }));
            
            return mappedDocs;
             }
    } catch (error) {
        console.error('Error fetching user:', error);
        return [];
    }
};

export const addRecents= async (userid,songId,songName,songImage) => {
    try {
       const res= await fetchHistory();
       let flag=0;
         res.map((doc)=>{
              if(doc.songId===songId){
                    flag=1;
              }})
        if(flag===0){
        await addDoc(songsReference2, {userId:userid,songId:songId,songName:songName,songUrl:songImage,timestamp:serverTimestamp()});
        }
    } catch (error) {
        console.error('Error adding like:', error);
    }
}
export const deleteRecents = async (id) => {
    try {
        await deleteDoc(doc(db, "recentSongs", id));
    } catch (error) {
        console.error('Error deleting like:', error);
    }
}
