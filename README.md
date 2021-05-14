# 15b!

Because it's complicated to reason about colours for old consoles when you also 
want them nicely packed, in the right format; it's easier to create a tool to 
create a palette and export it to a file.

<img src="https://i.imgur.com/2Y8g4hN.png =" width="429" heigth="279" />

## HOW TO

- npm i 
- npm start 
- ???
- make some sweet sweet palettes

## Example of a palette

<img src="https://i.imgur.com/o0Mb1uA.png" width="709" height="740" />

will yield

```C
const unsigned int myPal[7] = {
	0x76497549, 0x36573649, 0x51573557, 0x23572157, 0x4b5c4b57, 0x709c489c, 0x137c109c, 
};
```

## Current features

- create a 15bit colour and add to a palette
- replace a colour by clicking on it, change and clicking on replace
- or click on add again! 
- export colours as a C file containing an array with all colours correctly 
  packed – 2 by 2, little indian

## TODO

- gradient tool?
- randomizer?
- modify all palette colour using some colour algos (hue? tint?)
- load palette from a .pal file?
- save and reuse palette?

