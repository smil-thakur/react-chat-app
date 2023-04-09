import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./AuthContext";


export const ChatContext = createContext();


export const CharContextProvider = (({ children }) => {

    const currentUser = useContext(AuthContext).currentUser;

    const INITIAL_STATE = {
        chatid: "null",
        user: {}

    }

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                let uid2 = action.payload.uid
                let uid1 = currentUser.uid
                console.log(uid2)
                console.log(uid1)
                let uid = uid1 > uid2 ? uid1 + uid2 : uid2 + uid1
                console.log(uid)
                return {
                    user: action.payload,
                    chatid: uid
                }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    )

}


)