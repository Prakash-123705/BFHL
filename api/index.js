const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const FULL_NAME = "Gnanaprakash";
const DOB = "20112005";
const EMAIL = "gnanaprakashpathagunta@gmail.com";
const ROLL_NUMBER = "22BCE9694";

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ API is running! Use POST /bfhl");
});

// ✅ Main route
app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;

    let even_numbers = [];
    let odd_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let sum = 0;
    let concatChars = "";

    data.forEach(item => {
      const str = String(item);

      // Numbers
      if (/^-?\d+$/.test(str)) {
        let num = parseInt(str);
        sum += num;
        if (num % 2 === 0) {
          even_numbers.push(str);
        } else {
          odd_numbers.push(str);
        }

      // Alphabets
      } else if (/^[a-zA-Z]+$/.test(str)) {
        alphabets.push(str.toUpperCase());
        concatChars += str;

      // Special characters
      } else {
        special_characters.push(str);
      }
    });

    // Reverse + alternating caps
    let concat_string = concatChars
      .split("")
      .reverse()
      .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join("");

    res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });

  } catch (err) {
    res.status(500).json({ is_success: false, error: err.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
