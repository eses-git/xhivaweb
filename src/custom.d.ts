// In src/custom.d.ts

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// If you also use regular .css files, you can add this too
declare module '*.css';