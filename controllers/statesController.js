const State = require("../model/State");
const stateData = {
  state: require("../model/statesData.json"),
  setStates: function (stateData) {
    this.state = stateData;
  },
};

// GET requests
// all states
const getAll = async (req, res) => {
  const { contig } = req.query;
  // false contig
  if (contig === "false") {
    return res.json(
      stateData.state.filter((st) => st.code === "AK" || st.code === "HI")
    );
  }
  // true contig
  if (contig === "true") {
    return res.json(
      stateData.state.filter((st) => st.code != "AK" && st.code != "HI")
    );
  }
  // GET from mongoDB
  const funStates = await State.find();
  // for each state make funfacts array
  let allStates = stateData.state;
  allStates.forEach((state) => {
    const funStateExists = funStates.find((st) => st.stateCode == state.code);
    if (funStateExists) {
      let funArr = funStateExists.funfacts;
      if (funArr.length != 0) {
        state.funfacts = [...funArr];
      }
    }
  });
  // return response
  res.json(allStates);
};

// GET state
const getState = async (req, res) => {
  // find state from url
  const oneState = stateData.state.find(
    // make sure state code is upperCase
    (state) => state.code === req.params.state.toUpperCase()
  );
  // get from mongoDB
  const funOne = await State.find();
  // find funfacts
  const funStateExists = funOne.find((st) => st.stateCode === oneState.code);
  if (funStateExists) {
    let funArr = funStateExists.funfacts;
    //more than one fact
    if (funArr.length != 0) {
      oneState.funfacts = [...funArr];
    }
  }
  res.json(oneState);
};

// GET funfacts
const getFunFact = async (req, res) => {
  const oneState = stateData.state.find(
    // make sure state code is upperCase
    (state) => state.code === req.params.state.toUpperCase()
  );
  const funOne = await State.find();
  // check if funfacts exist
  const funStateExists = funOne.find((st) => st.stateCode == oneState.code);
  if (funStateExists) {
    let funArr = funStateExists.funfacts;
    console.log(funArr);
    let randomNum = Math.floor(Math.random() * funArr.length);
    let funfact = funArr[randomNum];
    res.json({ funfact });
  }
  if (!funStateExists) {
    return res.json({
      message: `No Fun Facts found for ${oneState.state}`,
    });
  }
};

// GET state capital
const getCapital = (req, res) => {
  const oneState = stateData.state.find(
    // make sure state code is upperCase
    (state) => state.code === req.params.state.toUpperCase()
  );
  // State & capital
  const state = oneState.state;
  const capital = oneState.capital_city;
  // return response
  res.json({ state, capital });
};

// GET nickname
const getNickname = (req, res) => {
  const oneState = stateData.state.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  // State & capital
  const state = oneState.state;
  const nickname = oneState.nickname;
  // return response
  res.json({ state, nickname });
};

// GET state population
const getPopulation = (req, res) => {
  const oneState = stateData.state.find(
    // make sure state code is upperCase
    (state) => state.code === req.params.state.toUpperCase()
  );

  // State & capital nam
  const state = oneState.state;
  const num = oneState.population;
  const population = num.toLocaleString("en-US");

  // return response
  res.json({ state, population });
};

// GET admission
const getAdmission = (req, res) => {
  const oneState = stateData.state.find(
    // make sure state code is upperCase
    (state) => state.code === req.params.state.toUpperCase()
  );
  //State name and capital nam
  const state = oneState.state;
  const admitted = oneState.admission_date;
  //return
  res.json({ state, admitted });
};

// PUT Requests
// CREATE funfact
const createFunFact = async (req, res) => {
  // verify funfact input
  if (!req?.body?.funfacts) {
    return res.status(400).json({ message: "State fun facts value required" });
  }
  // GET funfacts and code
  const stateCode = req.params.state.toUpperCase();
  const funfacts = req.body.funfacts;
  // funfacts must be array
  if (!(funfacts instanceof Array) || funfacts instanceof String) {
    return res
      .status(400)
      .json({ message: "State fun facts value must be an array" });
  }
  // find state in DB
  console.log(stateCode);
  const searchState = await State.findOne({ stateCode: stateCode }).exec();
  console.log(searchState);
  // if empty search, create
  if (!searchState) {
    try {
      const result = await State.create({
        stateCode: stateCode,
        funfacts: funfacts,
      });
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
    }
  } else {
    // push funfacts to array
    let funArr = searchState.funfacts;
    funArr = funArr.push(...funfacts);
    const result = await searchState.save();
    res.status(201).json(result);
  }
};

// PATCH Request
// UPDATE funfact
const updateFunFact = async (req, res) => {
  // verify body index
  if (!req.body.index) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }
  // verify body
  if (!req?.body.funfact) {
    return res.status(400).json({ message: "State fun fact value required" });
  }
  // find state, code, & funfacts
  const oneState = stateData.state.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  // make sure state code is upperCase
  const stateCode = req.params.state.toUpperCase();
  const searchState = await State.findOne({ stateCode: stateCode }).exec();
  if (!searchState) {
    return res.json({
      message: `No Fun Facts found for ${oneState.state}`,
    });
  }
  if (searchState.funfacts) {
    if (searchState.funfacts.length >= req.body.index) {
      searchState.funfacts[req.body.index - 1] = req.body.funfact;
    } else {
      return res.status(404).json({
        message: `No Fun Fact found at that index for ${oneState.state}`,
      });
    }
  }
  // save search result
  const result = await searchState.save();
  res.status(201).json(result);
};

// DELETE requests
// DELETE funfact
const deleteFunFact = async (req, res) => {
  // verify body is in index
  if (!req?.body.index) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }
  const oneState = stateData.state.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  // make sure state code is upperCase
  const stateCode = req.params.state.toUpperCase();
  const index = req.body.index - 1;
  const searchState = await State.findOne({
    stateCode: stateCode,
  }).exec();
  // if no funfacts return message
  if (!searchState) {
    return res.json({
      message: `No Fun Facts found for ${oneState.state}`,
    });
  }
  if (searchState.funfacts) {
    if (searchState.funfacts.length >= req.body.index) {
      searchState.funfacts.splice(index, 1);
    } else {
      return res.status(404).json({
        message: `No Fun Fact found at that index for ${oneState.state}`,
      });
    }
  }
  const result = await searchState.save();
  res.json(result);
};

// export all functions
module.exports.getAll = getAll;
module.exports.getState = getState;
module.exports.getFunFact = getFunFact;
module.exports.getCapital = getCapital;
module.exports.getNickname = getNickname;
module.exports.getPopulation = getPopulation;
module.exports.getAdmission = getAdmission;
module.exports.createFunFact = createFunFact;
module.exports.updateFunFact = updateFunFact;
module.exports.deleteFunFact = deleteFunFact;
