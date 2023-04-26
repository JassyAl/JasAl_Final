const express = require("express");
const router = express.Router();
const verifyStates = require("../../middle/stateVerify");
const statesController = require("../../controllers/statesController");

// get all router
router.get("/", statesController.getAll);

// get state router
router.get("/:state", verifyStates, statesController.getState);

// get funfact router
router.get("/:state/funfact", verifyStates, statesController.getFunFact);

// create router
router.post("/:state/funfact", verifyStates, statesController.createFunFact);

// patch router
router.patch("/:state/funfact", verifyStates, statesController.updateFunFact);

// delete router
router.delete("/:state/funfact", verifyStates, statesController.deleteFunFact);

// get capital router
router.get("/:state/capital", verifyStates, statesController.getCapital);

// get nickname router
router.get("/:state/nickname", verifyStates, statesController.getNickname);

// get population router
router.get("/:state/population", verifyStates, statesController.getPopulation);

// get admission router
router.get("/:state/admission", verifyStates, statesController.getAdmission);

module.exports = router;
