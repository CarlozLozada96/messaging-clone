import {
  createContext,
  useContext,
  useReducer,
} from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    user: {},
    chatId: "null",
    selectedChannel: null,
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          ...state,
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };
      case "SET_SELECTED_CHANNEL":
        const selectedChannel = action.payload;
        const { id: channelId, name: channelName } = selectedChannel;
        const chatId =
          currentUser.uid > channelId
            ? `${channelId}`
            : `${channelId}`;

        console.log('Chat Id:', chatId); 
        return {
          ...state,
          selectedChannel,
          chatId,
        };
      default:
        console.log('Current Chat Id:', state.chatId); 
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

ChatContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};