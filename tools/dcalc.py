import sys
import math

def mod(stat):
    return math.floor((stat - 10) / 2)

def main():
    # Check arguments
    if len(sys.argv) < 5:
        print("Usage: python dcalc.py <damage> <target armor category> <target constitution value> <target actual endurance> (<target added absorption/deviation)")
        return

    # Get arguments
    initial_damage = math.floor(float(sys.argv[1]))
    armor = math.floor(float(sys.argv[2]))
    const = math.floor(float(sys.argv[3]))
    endurance = math.floor(float(sys.argv[4]))
    deviation = 0
    if len(sys.argv) > 5:
        deviation = math.floor(float(sys.argv[5]))

    # Initialize some variables
    damage = initial_damage
    pv_damage = 0
    pe_damage = 0
    pe_loss_reduction = 0
    resistance = armor
    absorption = math.floor(armor * 3 + mod(const)) + deviation
    wound_threshold = 10 + armor

    # First thing first resistance is applied
    damage -= resistance

    if damage < absorption:
        pe_loss_reduction = absorption - damage

    if damage * 2 < absorption:
        print(f'Target takes no damage.')
        exit()

    # Then absorption let's target absorb damage with endurance for a ratio of 1:1
    absorbed_damage = min(damage, absorption, endurance)

    # Then we apply this reduction
    damage -= absorbed_damage
    pe_damage += absorbed_damage
    endurance -= pe_damage

    # Then we check if target have some endurance left to absord more damage
    if damage > 0:
        max_extra_absorption = math.floor(endurance / 2)
        if max_extra_absorption > 0:
            max_extra_absorption = max_extra_absorption if damage > max_extra_absorption else damage

            damage -= max_extra_absorption
            pe_damage += max_extra_absorption * 2

    pv_damage += damage
    pe_damage -= pe_loss_reduction

    if pe_damage < 0:
        pe_damage = 0

    print(f'Target loose {pv_damage} PV and {pe_damage} PE.')

    if pv_damage > 0:
      penalty = math.floor(initial_damage / wound_threshold)
      print(f'Target also get a wound ({initial_damage}/{wound_threshold}) (penalty is {penalty}).')

if __name__ == "__main__":
    main()
