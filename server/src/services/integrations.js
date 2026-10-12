import Stripe from 'stripe';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export const stripe = env.stripeSecretKey ? new Stripe(env.stripeSecretKey) : null;

if (env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret) {
  cloudinary.config({ cloud_name: env.cloudinaryCloudName, api_key: env.cloudinaryApiKey, api_secret: env.cloudinaryApiSecret });
}

export const uploadImage = async (dataUri, folder) => {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) throw new Error('Cloudinary is not configured');
  const result = await cloudinary.uploader.upload(dataUri, { folder });
  return result.secure_url;
};

export const sendEmail = async ({ to, subject, html }) => {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) return false;
  const transporter = nodemailer.createTransport({ host: env.smtpHost, port: env.smtpPort, secure: env.smtpPort === 465, auth: { user: env.smtpUser, pass: env.smtpPass } });
  await transporter.sendMail({ from: env.smtpFrom || env.smtpUser, to, subject, html });
  return true;
};
