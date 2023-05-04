# SO YOU GOT OUT OF YOUR SERVER
# NOW WHAT?
# !!!!IMPORTANT DO THIS FIRST!!!!
# first allow all connections from your.ip
iptables -I INPUT -p tcp -s your.ip -j ACCEPT
iptables -I OUTPUT -p tcp -d  your.ip -j ACCEPT
# then delete the chain
iptables -F chain_name
iptables -D INPUT -j chain_name 
iptables -X chain_name
# COMMANDS TO HELP YOU GET BACK IN
iptables -L                                     # list all rules in INPUT chain
iptables -L INPUT                               # list all rules in INPUT chain
iptables -D INPUT -j chain_name                 # delete all rules in INPUT chain refer to chain_name (links)
iptables -F chain_name                          # flush all rules in chain (links) 
iptables -X chain_name                          # delete chain 
iptables -I INPUT -p tcp -s your.ip -j ACCEPT   # prepend rule to INPUT chain and accept connection from your.ip
iptables -I OUTPUT -p tcp -d  your.ip -j ACCEPT # prepend rule to OUTPUT chain and accept connection to your.ip
iptables -A INPUT -p tcp -s your.ip -j          # append rule to INPUT chain and accept connection from your.ip
iptables -A OUTPUT -p tcp -d  your.ip -j ACCEPT # append rule to OUTPUT chain and accept connection to your.ip
iptables -L --line-numbers                      # list all rules in INPUT chain with line numbers
iptables -D INPUT 1                             # delete rule 1 in INPUT chain
iptables -D OUTPUT 1                            # delete rule 1 in OUTPUT chain

