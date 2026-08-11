import asyncHandler from '../utils/asyncHandler.js'; import { askAgriLink } from './ai.service.js'; import { recommendationsFor } from './ai.tools.js';
export const chat = asyncHandler(async (req, res) => { const result = await askAgriLink(req.user, req.body.message); res.json({ success: true, ...result }); });
export const recommendations = asyncHandler(async (req, res) => res.json({ success: true, data: await recommendationsFor(req.user) }));
