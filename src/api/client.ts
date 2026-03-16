import axios from 'axios';
import { env } from '../config/env';

export const apiClient = axios.create({
  baseURL: env.glApiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
