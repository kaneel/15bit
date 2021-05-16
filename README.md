# 15b!

Because it's complicated to reason about colours for old consoles when you also 
want them nicely packed, in the right format; it's easier to create a tool to 
create a palette and export it to a file.

## HOW TO

- npm i 
- npm start 
- ???
- make some sweet sweet palettes

## Example of a palette

```C
const unsigned int myPal[7] = {
	0x76497549, 0x36573649, 0x51573557, 0x23572157, 0x4b5c4b57, 0x709c489c, 0x137c109c, 
};
```

## Current features

- create a 15bit colour and add to a palette
- replace a colour by clicking on it, pick it, modify and click on swap! 
- gradient tool: once you have two colours at least, open the gradient tool, 
  select two adjacent ones, a number of steps, and OK!
- export colours as a C file containing an array with all colours correctly 
  packed – 2 by 2, little indian

## TODO

- randomizer?
- modify all palette colour using some colour algos (hue? tint?)
- load palette from a .pal file?
- save and reuse palette later?

