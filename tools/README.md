# Tools

## Damage Calculator

Tool which let you calculate how many damage are inflicted on a successfull attack in Terre Natale TTRPG.

### Usage

Arguments:

- `python dcalc.py <damage> <target armor category> <target constitution value> <target actual endurance> (<target added absorption/deviation)`
- `damage` : Damage which are inflicted, likeley the result of the dice throw for its attack (plus bonuses if any).
- `target armor category` : Armor of the target, likely from 0 to 4+.
- `target constitution value` : Constitution of the target, likely from 6 to 20+.
- `target actual endurance` : Endurance of the target, likely from 0 to 40+.
- `target added abs/dev` : Added absorption or deviation (which are the same in the end), likely from 0 to a lot (if target got its defense rights for instance).

## Example

[lutie@pc-6 tools]$ python dcalc.py 26 3 12 2
Target loose 21 PV and 2 PE.
Target also get a wound (26/13) (penalty is 2).
