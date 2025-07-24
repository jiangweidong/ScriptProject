import nmap
import socket
import os
import sys

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

def scan_network(network):
    nmap_path = ["D:/Nmap/nmap.exe"]
    if sys.platform.startswith('win32'):
        # For Windows, provide the default installation path for Nmap
        program_files = os.environ.get('ProgramFiles(x86)') or os.environ.get('ProgramFiles')
        nmap_path.append(os.path.join(program_files, 'Nmap', 'nmap.exe'))
    
    try:
        nm = nmap.PortScanner(nmap_search_path=tuple(nmap_path) or ('nmap',))
    except nmap.nmap.PortScannerError:
        print("Nmap not found. Please install it from https://nmap.org/download.html and ensure it's in your system's PATH or the script is pointing to the correct location.")
        return

    # The -sn flag is for a ping scan, which is used to discover hosts.
    # The -T4 flag makes the scan faster.
    nm.scan(hosts=network, arguments='-sn -T4')
    hosts_list = [(x, nm[x]['status']['state']) for x in nm.all_hosts()]
    for host, status in hosts_list:
        print(f"Host: {host} ({status})")
        # Now, scan for open ports on the discovered host
        # We scan the most common 1000 ports. For a full scan, use '1-65535'
        nm.scan(hosts=host, arguments='-p 1-1000 -T4')
        if host in nm.all_hosts():
            if 'tcp' in nm[host]:
                for port in nm[host]['tcp'].keys():
                    print(f"  Port: {port}/tcp, State: {nm[host]['tcp'][port]['state']}, Service: {nm[host]['tcp'][port]['name']}")

if __name__ == "__main__":
    local_ip = get_local_ip()
    # Create the network range to scan, e.g., 192.168.1.0/24
    ip_parts = local_ip.split('.')
    network_to_scan = f"{ip_parts[0]}.{ip_parts[1]}.{ip_parts[2]}.0/24"
    print(f"Scanning network: {network_to_scan}")
    scan_network(network_to_scan)
