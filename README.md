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

https://user-images.githubusercontent.com/1093029/118471041-378f8380-b6ff-11eb-91e5-0399711c9f0c.mov

<img src="https://i.imgur.com/7qCGfU2.png?1" width="1011" />

```C
const unsigned int myPal[10] = {
	0x7e327e31, 0x7e347e33, 0x7e377e35, 0x7e397e38, 0x7e3b7e3a, 0x7e3d7e3c, 0x7e3f7e3e, 0x54117e3f, 0x54137e3f, 0x54157e3f 
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

