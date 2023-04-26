const statesData = require("../model/statesData.json");

// verify state
const stateVerify = (req, res, next) => {
  // set state code to upperCase
  const states = req.params.state.toUpperCase();
  // state code array
  const stateCode = statesData.map((state) => state.code);
  // match state code with state
  const matchState = stateCode.find((code) => code === states);

  // if not match found
  if (!matchState) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }
  req.params.state = states;
  next();
};

module.exports = stateVerify;
