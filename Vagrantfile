$GIT_INSTALL = <<SCRIPT
  echo 'StrictHostKeyChecking no' > ~/.ssh/config
  echo 'UserKnownHostsFile=/dev/null no' >> ~/.ssh/config
  sudo apt-get update > /dev/null
  sudo apt-get install git -y
SCRIPT

Vagrant.require_version '>= 1.8.3'

Vagrant.configure(2) do |config|
  ram = 2048
  cpu = 2
  guest_port = 8080
  host_port = 8080
  dev_ip = '192.168.33.35'
  project_name='crypto-pro-provider'

  config.vm.provider 'virtualbox' do |v|
    v.memory = ram
    v.cpus = cpu
  end

  config.vm.network 'forwarded_port', guest: guest_port, host: host_port

  # Development VM
  config.vm.define 'dev', primary: true do |dev|
    dev.vm.box = 'ubuntu/trusty64'
    dev.vm.hostname = "app-dev"
    dev.vm.network 'private_network', ip: dev_ip
    dev.ssh.forward_agent = true
    dev.vm.synced_folder './', "/home/vagrant/#{project_name}", owner: 'vagrant', group: 'vagrant'

    dev.vm.provision :shell, keep_color: true, inline: $GIT_INSTALL

    dev.vm.provision :ansible_local do |ansible|
      ansible.provisioning_path = '/vagrant/cm/'
      ansible.galaxy_role_file  = 'requirements.yml'
      ansible.galaxy_roles_path = 'roles/'
      ansible.playbook          = 'vagrant.yml'
      ansible.verbose           = true
      ansible.limit             = 'local'
      ansible.inventory_path    = 'inventory'
    end
  end

  # Use vagrant-cachier to cache apt-get, gems and other stuff across machines
  config.cache.scope = :box if Vagrant.has_plugin?('vagrant-cachier')
end
