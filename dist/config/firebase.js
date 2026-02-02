"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = exports.db = void 0;
exports.initFirebaseApp = initFirebaseApp;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function initFirebaseApp() {
    if (firebase_admin_1.default.apps.length > 0)
        return firebase_admin_1.default.app();
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw)
        throw new Error("FIREBASE_SERVICE_ACCOUNT não encontrada!");
    const serviceAccount = JSON.parse(raw);
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }
    return firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
    });
}
const app = initFirebaseApp();
exports.db = firebase_admin_1.default.firestore();
exports.adminAuth = firebase_admin_1.default.auth();
exports.default = app;
