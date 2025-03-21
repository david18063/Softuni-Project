import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams(); // Get book ID from the URL
  const [book, setBook] = useState(null);
  const [selectedVote, setSelectedVote] = useState(null);
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "lev");
  const userId = localStorage.getItem("loggedUser");

  useEffect(() => {
    fetch(`http://localhost:5000/books/${id}`)
      .then((response) => response.json())
      .then((data) => setBook(data))
      .catch((error) => console.error("❌ Error fetching book details:", error));
  }, [id]);

  const convertPrice = (price) => {
    const exchangeRates = { 
      lev: 1, 
      dollar: 0.55, 
      euro: 0.51 
    };

    const symbols = {
      lev: "лв.",
      dollar: "$",
      euro: "€"
    };

    if (!exchangeRates[currency]) return `${price} лв.`; // Fallback

    return `${(price * exchangeRates[currency]).toFixed(2)} ${symbols[currency]}`;
  };

  const handleVoteChange = (event) => {
    setSelectedVote(parseInt(event.target.value, 10));
  };

  const handleVoteSubmit = async (event) => {
    event.preventDefault();
  
    const loggedUser = localStorage.getItem("loggedUser");
  
    if (!loggedUser) {
      alert("🔒 Трябва да сте влезли в системата, за да гласувате!");
      return;
    }
  
    const parsedUser = JSON.parse(loggedUser); // ✅ Convert JSON string to object
    const userId = parsedUser.ID; // ✅ Extract only the ID
  
    if (!selectedVote) {
      alert("❌ Моля, изберете оценка!");
      return;
    }
  
    const requestBody = JSON.stringify({
      userId, // ✅ Send only the user ID
      bookId: id,
      vote: selectedVote
    });
  
    console.log("📡 Sending vote request:", requestBody); // Debugging log
  
    try {
      const response = await fetch("http://localhost:5000/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      alert(data.success ? "✅ Гласуването е успешно!" : "❌ Грешка при гласуването!");
    } catch (error) {
      console.error("❌ Error submitting vote:", error);
      alert("❌ Грешка при изпращането на гласа!");
    }
  };

  if (!book) {
    return <p>⏳ Зареждане на детайлите за книгата...</p>;
  }

  return (
    <div className="center_content">
      <div className="center_title_bar">Подробности</div>
      <div className="prod_box_big">
        <div className="center_prod_box_big">
          <div className="product_img_big">
            <img src={book.ImagePath} alt={book.Name} style={{ width: "110px", height: "165px" }} />
          </div>
          <div className="details_big_box">
            <div className="product_title_big">{book.Name}</div>
            <div className="specifications">
              <p>Автор: <span className="blue">{book.Author}</span></p>
              <p>Издателство: <span className="blue">{book.Publisher}</span></p>
            </div>

            {/* 🔹 Voting System */}
            <div>
              <form onSubmit={handleVoteSubmit}>
                <label>Оценка: </label>
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num}>
                    <input
                      type="radio"
                      name="vote"
                      value={num}
                      checked={selectedVote === num}
                      onChange={handleVoteChange}
                    />
                    {num}
                  </label>
                ))}
                &nbsp;
                <button type="submit">Гласувай</button>
              </form>
            </div>

            <div className="prod_price_big">
              <label>Цена: </label>
              <div>
                <span className="reduce">{convertPrice(book.OldPrice)}</span>
                <span className="price">{convertPrice(book.Price)}</span>
              </div>
            </div>

            <div style={{ marginTop: "10px", marginBottom: "20px" }}>
              Добави в кошницата &nbsp; В Любими &nbsp; Редактиране
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
