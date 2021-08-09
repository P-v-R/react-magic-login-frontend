import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { magic } from "../magic";
import Loading from "./Loading";

let SERVER_URL = "http://localhost:3001"


export default function Callback() {
  const history = useHistory();

  useEffect(() => {
    // get magic credential from url query
    const magicCredential = new URLSearchParams
      (window.location.search).get('magic_credential');
      // if fetching magicCredential successful - get DIDToken and validate on server 
    if (magicCredential) {
      magic.auth.loginWithCredential()
        .then(didToken => {
          console.log("token ->", didToken)
          // debugger;
          authenticateWithServer(didToken)
        }
        );
    };

    // Send DIDtoken to server to validate
    const authenticateWithServer = async didToken => {
      console.log("sending didtoken to server")
      const res = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
          // possibly include a _token to make jwt for short term session storage as well
          // _token:'users email/something to turn into jwt'
        },
      });
      console.log("res from server fetch --->", res)
      if (res.status === 200) {
        // Set the UserContext to the now logged in user
        const userMetadata = await magic.user.getMetadata();
        console.log("UMD FE -->", userMetadata)
        
        // setUser below could be context 
        // await setUser(userMetadata);
        
        history.push('/profile');
      } else {
        history.push('/login')
      }
    };

    // On mount, we try to login with a Magic credential in the URL query.
    // console.log("hitting debugger 1")

  //   magic.auth.loginWithCredential().finally(() => {
  //     // console.log("hitting debugger 2")
  //     // debugger;
  //     history.push("/");
  //   });
  }, []);


  return <Loading />;
}