import { createContext, useContext, useState } from "react";

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [showaddchannel, setShowaddchannel] = useState(false);
  const [showsendchannel, setshowsendchannel] = useState(false);
  const [showchannelname, setshowchannelname] = useState(false);
  const [showsenddm, setshowsenddm] = useState(false);
  const [showname, setshowname] = useState(false);

  const handleShowAddChannel = () => {
    setShowaddchannel(true);
  }

  const handleHideAddChannel = () => {
    setShowaddchannel(false);
  }

  const handleShowsendchannel = () => {
    setshowsendchannel(true);
  }

  const handlehidesendchannel = () => {
    setshowsendchannel(false);
  }


  const handleShowsenddm = () => {
    setshowsenddm(true);
  }

  const handlehidesenddm = () => {
    setshowsenddm(false);
  }
  const handleshowchannelname = () => {
    setshowchannelname(true);
  }
  const handlehidechannelname = () => {
    setshowchannelname(false);
  }

  const handleshowname = () => {
    setshowname(true);
  }
  const handlehidename = () => {
    setshowname(false);
  }

  return (
    <SelectionContext.Provider value={{
      channels, setChannels, showaddchannel,
      handleShowAddChannel, handleHideAddChannel, showsendchannel,
      handleShowsendchannel, handlehidesendchannel, showsenddm,
      handleShowsenddm, handlehidesenddm, showchannelname, handleshowchannelname,
      handlehidechannelname, showname, handleshowname, handlehidename
    }}>
      {children}
    </SelectionContext.Provider>
  );
};

const useSelectionContext = () => useContext(SelectionContext);

export default useSelectionContext;