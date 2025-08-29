const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(express.json());

function formatUserId(fullName, dob) {
    return `${fullName.toLowerCase().replace(/ /g, '_')}_${dob}`;
}

function isAlphabet(char) {
    return /^[A-Za-z]$/.test(char);
}

function isNumber(value) {
    return typeof value === 'number' || /^\d+$/.test(value);
}

function isSpecialChar(char) {
    return typeof char === "string" && !/^[A-Za-z0-9]$/.test(char);
}

function altCapsReverse(str) {
    let s = str.split('').reverse().join('');
    let result = '';
    for (let i = 0; i < s.length; i++) {
        result += i % 2 === 0 ? s[i].toUpperCase() : s[i].toLowerCase();
    }
    return result;
}

app.post('/bfhl',
  [
    body('data').isArray().withMessage("'data' must be an array"),
    body('full_name').notEmpty().withMessage('full_name is required'),
    body('dob').notEmpty().withMessage('dob is required'),
    body('email_id').isEmail().withMessage('email_id must be a valid email'),
    body('college_roll_number').notEmpty().withMessage('college_roll_number is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        is_success: false,
        error: errors.array().map(err => err.msg).join(', ')
      });
    }

    const { data, full_name, dob, email_id, college_roll_number } = req.body;

    let nums = [];
    let letters = [];
    let specials = [];

    data.forEach(item => {
        if (isNumber(item)) {
            let num = typeof item === 'number' ? item : parseInt(item);
            nums.push(num);
        } else if (typeof item === "string" && item.length === 1 && isAlphabet(item)) {
            letters.push(item);
        } else if (typeof item === "string" && isSpecialChar(item)) {
            specials.push(item);
        } else if (typeof item === "string" && item.length > 1 && /^[A-Za-z]+$/.test(item)) {
            // treat multi-char alphabetic strings as alphabets (like "ABcD")
            letters.push(item);
        }
    });

    // Separate even and odd numbers and convert all numbers to strings for response
    let evenNums = nums.filter(n => n % 2 === 0).map(String);
    let oddNums = nums.filter(n => n % 2 !== 0).map(String);

    // Uppercase alphabets (including multi-char strings)
    let uppercaseAlphabets = letters.map(l => l.toUpperCase());

    // Sum as string
    let sumOfNums = String(nums.reduce((a, b) => a + b, 0));

    // Concat string: reverse all letters concatenated and alternate caps
    let concatAlpha = altCapsReverse(letters.join(''));

    res.status(200).json({
        is_success: true,
        user_id: formatUserId(full_name, dob),
        email: email_id,
        roll_number: college_roll_number,
        odd_numbers: oddNums,
        even_numbers: evenNums,
        alphabets: uppercaseAlphabets,
        special_characters: specials,
        sum: sumOfNums,
        concat_string: concatAlpha
    });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
