import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import SelectSearch from "react-select-search";
import Card from "./Card";

export default function App() {
  const [opencards, setOpenCards] = useState(0);
  const [firstOpen, setFirstOpen] = useState(null);
  const [cards, setCards] = useState([]);
  const [user, setUser] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  const [won, setWon] = useState(false);
  const [cursor, setCursor] = useState("");

  async function getCards() {
    setWon(false);
    setGameLoading(true);
    setGameStarted(true);
    setCards([]);
    setOpenCards(0);
    const data = await axios.get(
      `https://www.instagram.com/graphql/query/?query_hash=42323d64886122307be10013ad2dcc44&variables={"id":"${user}","first":6,"after":"${cursor}"}`
    );
    setCursor(
      data.data.data.user.edge_owner_to_timeline_media.page_info.end_cursor
    );
    let fetchedcards = [];
    data.data.data.user.edge_owner_to_timeline_media.edges.forEach(
      (item, idx) => {
        fetchedcards.push({
          rotatey: 0,
          flipped: false,
          solved: false,
          id: idx,
          group: item.node.id,
          src: item.node.display_url
        });
        fetchedcards.push({
          rotatey: 0,
          flipped: false,
          solved: false,
          id: idx + 100,
          group: item.node.id,
          src: item.node.display_url
        });
      }
    );
    shuffle(fetchedcards);
    setCards([...fetchedcards]);
    setGameLoading(false);
  }
  function handleReset() {
    setUser("");
    setGameStarted(false);
    setCursor("");
    setWon(false);
  }

  function renderUser(props, option, snapshot, className) {
    const imgStyle = {
      borderRadius: "50%",
      verticalAlign: "middle",
      marginRight: 5
    };

    return (
      <button {...props} className={className} type="button">
        <span>
          <img
            alt=""
            style={imgStyle}
            width="32"
            height="32"
            src={option.photo}
          />
          <span>{option.name}</span>
        </span>
      </button>
    );
  }

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  useEffect(() => {
    if (cards.every(checkWin) && cards.length > 0) {
      setTimeout(() => {
        setWon(true);
      }, 750);
    }
    let tempopens = [];
    cards.forEach((item) => {
      if (item.flipped && !item.solved) {
        tempopens.push(item.group);
      }
    });
    if (tempopens.length === 2) {
      if (tempopens[0] === tempopens[1]) {
        setOpenCards(0);
        let tempcards = cards.map((item) =>
          item.group === tempopens[0] ? { ...item, solved: true } : item
        );
        setCards(tempcards);
        setFirstOpen(null);
        tempopens = [];
      } else {
        let tempcards = cards.map((item) =>
          Object.assign({ ...item, flipped: false })
        );
        setTimeout(() => {
          setCards(tempcards);
          setOpenCards((prevCount) => 0);
          setFirstOpen(null);
        }, 750);
        tempopens = [];
      }
    } else {
      tempopens = [];
    }
  }, [opencards]);

  const checkWin = (currentValue) => currentValue.solved === true;

  function handleFlip(id) {
    if (firstOpen === id) {
      return;
    } else {
      if (opencards < 2) {
        setFirstOpen(id);
        const updatedCards = cards.map((item) =>
          item.id === id && !item.solved
            ? Object.assign({ ...item, flipped: true })
            : item
        );
        setCards(updatedCards);
        setOpenCards((prevCount) => prevCount + 1);
      } else {
        const updatedCards = cards.map((item) => {
          var temp = Object.assign({}, item);
          temp.flipped = false;
          return temp;
        });
        setCards(updatedCards);
        setOpenCards(0);
      }
    }
  }
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {!gameStarted && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <h3 style={{ marginBottom: 10 }}>
            Search for an instagram user to start
          </h3>
          <SelectSearch
            className="select-search"
            options={[]}
            renderOption={renderUser}
            closeOnSelect={true}
            onChange={setUser}
            search
            placeholder="User Name"
            getOptions={(query) => {
              return new Promise((resolve, reject) => {
                fetch(
                  `https://www.instagram.com/web/search/topsearch/?query=${query}`
                )
                  .then((response) => response.json())
                  .then((data) => {
                    resolve(
                      data.users.map((item) => ({
                        value: item.user.pk,
                        name: item.user.username,
                        photo: item.user.profile_pic_url
                      }))
                    );
                  })
                  .catch(reject);
              });
            }}
          />
          <Button
            style={{ marginTop: 10 }}
            variant="contained"
            color="primary"
            onClick={() => getCards()}
          >
            Start
          </Button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "calc(100vh-48px)"
        }}
      >
        {gameLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              alignSelf: "center"
            }}
          >
            <h1>Loading...</h1>
            <CircularProgress />
          </div>
        )}
        {gameStarted && !gameLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              width: "100vw",
              maxWidth: "100%",
              height: "calc(100vh-50px)",
              maxHeight: "100%"
            }}
          >
            {cards.map((item, idx) => {
              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    ease: "easeOut",
                    duration: 0.3,
                    delay: idx * 0.1
                  }}
                >
                  <Card key={idx} item={item} handleFlip={handleFlip} />
                </motion.div>
              );
            })}
          </div>
        ) : (
          ""
        )}
      </div>
      <Dialog
        fullWidth
        maxWidth={"xs"}
        open={won}
        onClose={() => {}}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogContent
          dividers
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <DialogContentText>You Win!</DialogContentText>
          <Button onClick={() => getCards()} color="primary">
            Next Batch
          </Button>
          <Button onClick={() => handleReset()} color="primary">
            New User
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
