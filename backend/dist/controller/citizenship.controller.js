"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinCitizenship = void 0;
const joinCitizenship = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        //TODO: call smart contract to add a citizen to a continent
        return res.send({ success: true, message: "Citizen added successfully", data: {} });
    }
    catch (err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});
exports.joinCitizenship = joinCitizenship;
