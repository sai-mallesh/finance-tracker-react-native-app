import {createClient} from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
const supabaseUrl = 'https://ivjumsvhbdkezpqkvvja.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2anVtc3ZoYmRrZXpwcWt2dmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjYzOTUsImV4cCI6MjAxNDg0MjM5NX0.yYjhhgia9umwt_63tKF99NTw1ZkD4MAFfsz4i1KOe9Q';
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
