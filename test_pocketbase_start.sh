./pocketbase serve > pocketbase_output.log 2>&1 &
echo "Waiting for PocketBase to start..."
while ! curl -s http://127.0.0.1:8090/api/health > /dev/null; do
  sleep 0.5
done
echo "PocketBase is up!"
