export const NODE_ENV: String = process.env.NODE_ENV || ''
export const ROOT_FOLDER =
NODE_ENV === 'development'
  ? __dirname
  : __dirname.replace('/node_modules/assertz', '')