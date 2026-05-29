# Minimal Dice Roller Chrome Extension

* A simple polyhedral / RPG / wargame dice roller with predefined buttons for the common physical dice types (D4, D6, D8, D10, D12, D20), percentile (D100) and Fudge/FATE dice (DF), plus additional less common dice (D2, D3, D5, D7, D14, D16, D24, D30, D60, D120) which are initially hidden by default. 
* Change how many dice are rolled by typing in the desired number in the appropriate row "#" column, values are now persisted between uses. 
* Checkbox option to treat the dice rolled as "percentile" instead of summing (so 2D6 becomes a "D66" result)
* Individual die rolls are also displayed in the Dice Pool textbox if you want the separate numbers instead of the sum. 
* Results can be copied and pasted, and there is a new option to persist results after the popup is dismissed, and a button to clear all result fields.
* Options page allows selection of which dice are shown or hidden, so you can hide all the ones you don't use, dice displayed in the popup are sorted by max value
* Options to customize dice definitions, so your D10 can be numbered 0-9 instead of 1-10, or edit any unused definition into a custom die with a unique value range, dice are "auto-named" by their max value so you can have for example multiple D10 definitions (0 to 9 and 1 to 10) but not fake a D20 that only rolls 20
* Popup uses light/dark mode depending on OS theme (css @media (prefers-color-scheme: dark)) 

Icon was edited from Public Domain resource "Colorful Dices 128x128"\
https://opengameart.org/content/colorful-dices-128x128

## History
* 0.1.0 - Initial release
* 0.2.0 - Inputs in "#" column now have spin buttons and reject non-numeric input, changed values are now saved to extension storage, popup width expanded slightly
* 0.3.0 - Added extra dice definitions, added "percentile" checkbox option, added "Clear All" button, added Options page to allow customizing of dice definitions and to select which dice are shown in the popup
* 0.3.1 - Minor CSS adjustments (specified sans-serif font, made default light mode colors less bright, adjusted dark mode input field colors slightly), implemented FireFox compatibility, internal rewrite of html generation to eliminate linting warnings