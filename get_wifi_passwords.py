import subprocess
import re

def get_wifi_passwords():
    """
    Retrieves and prints the passwords for all saved Wi-Fi networks on a Windows machine.
    """
    try:
        # Get all Wi-Fi profiles
        profiles_command = "netsh wlan show profiles"
        profiles_output = subprocess.check_output(profiles_command, shell=True, text=True, encoding='utf-8', errors='ignore')
        
        profile_names = re.findall(r"All User Profile\s*:\s*(.*)", profiles_output)
        
        if not profile_names:
            print("No Wi-Fi profiles found.")
            return

        print("Found Wi-Fi Profiles:")
        for name in profile_names:
            name = name.strip()
            profile_info_command = f'netsh wlan show profile name="{name}" key=clear'
            
            try:
                profile_info_output = subprocess.check_output(profile_info_command, shell=True, text=True, encoding='utf-8', errors='ignore')
                password_match = re.search(r"Key Content\s*:\s*(.*)", profile_info_output)
                
                if password_match:
                    password = password_match.group(1).strip()
                    print(f"  SSID: {name}, Password: {password}")
                else:
                    print(f"  SSID: {name}, Password: Not Found (Open Network or no password saved)")
            except subprocess.CalledProcessError:
                print(f"  Could not retrieve info for profile: {name}")

    except subprocess.CalledProcessError:
        print("Error executing netsh command. Make sure you are running this on a Windows machine.")
    except FileNotFoundError:
        print("The 'netsh' command was not found. This script is intended for Windows.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    get_wifi_passwords()
