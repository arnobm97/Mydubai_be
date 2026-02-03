const dns = require('dns');

// Force Google DNS (bypass VPN/ISP DNS)
dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log('DNS servers set to:', dns.getServers());

// Test DNS resolution first
console.log('\n🔍 Testing DNS resolution...');
dns.lookup('cluster0.jupqkx4.mongodb.net', (err, address) => {
  if (err) {
    console.log('❌ DNS lookup failed:', err.message);
  } else {
    console.log(`✅ Resolved to IP: ${address}`);
    
    // Now test MongoDB connection
    console.log('\n🔗 Testing MongoDB connection...');
    const mongoose = require('mongoose');
    
    const uri = "mongodb+srv://arnobm97_db_user:aqbH80dxdMY4iD7c@cluster0.jupqkx4.mongodb.net/?appName=Cluster0";
    
    mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    }).then(() => {
      console.log('✅ SUCCESS! MongoDB connected with DNS fix.');
      console.log('\n🎉 Add this line to your app.ts:');
      console.log("require('dns').setServers(['8.8.8.8', '8.8.4.4']);");
      process.exit(0);
    }).catch(err => {
      console.log('❌ Connection failed:', err.message);
      
      // Try non-SRV as fallback
      console.log('\nTrying non-SRV connection...');
      const uri2 = "mongodb://arnobm97_db_user:aqbH80dxdMY4iD7c@cluster0.jupqkx4.mongodb.net:27017/?directConnection=true&authSource=admin&ssl=true&retryWrites=true&w=majority";
      
      mongoose.connect(uri2).then(() => {
        console.log('✅ SUCCESS with non-SRV connection!');
        console.log('\n🎉 Use this in config.dev.json:');
        console.log(`"mongoUrl": "${uri2}"`);
        process.exit(0);
      }).catch(err2 => {
        console.log('❌ Both attempts failed:', err2.message);
        process.exit(1);
      });
    });
  }
});