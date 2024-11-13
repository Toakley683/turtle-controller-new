term.clear()
term.setCursorPos(1, 1)

local firstnameReq = http.get("https://raw.githubusercontent.com/FinNLP/humannames/refs/heads/master/list.txt")

if os.getComputerLabel() == nil then
	local name = ""

	local NameIndex = math.random(1, 180000)

	for Index = 1, NameIndex do
		name = firstnameReq.readLine()
	end

	write("Is now: " .. name .. "\n")
	os.setComputerLabel(name)
end

fs.makeDir("./data/")
local exists = fs.exists("./data/id.txt")

local chartable = {}
local chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

for char in string.gmatch(chars, ".") do
	table.insert(chartable, char)
end

local index = ""

if not exists then
	local file = fs.open("./data/id.txt", "w")

	for x = 1, 8 do
		for y = 1, 8 do
			local id = math.random(1, #chartable)
			index = index .. chartable[id]
		end

		if x ~= 8 then
			index = index .. "-"
		end
	end

	file.write(index)
	file.close()
else
	local file = fs.open("./data/id.txt", "r")

	index = file.readAll()
	file.close()
end

local area = "new_turtle"
local Attempts = 0
local maxAttempts = 3

local disk = peripheral.find("drive")

local url = nil
local x = nil
local y = nil
local z = nil
local facing = nil
local ans = nil

if disk then
    
    local File = fs.open( disk.getMountPath() .. "/data/info.txt", "r" )
        
    url = File.readLine()
    //x = File.readLine()
    //y = File.readLine()
    //z = File.readLine()
    //facing = File.readLine()
    //ans = File.readLine()
    
    File.close()
    
end

repeat
	write("NGROK URL: ")
	if not url then url = read() end

	term.clear()
	term.setCursorPos(1, 1)

	write("Invalid URL\n")
	write("Attempts left " .. (maxAttempts - Attempts) .. "\n")
	write("\n")

	if not http.checkURL(url .. "/" .. area) then
		Attempts = Attempts + 1
		if Attempts > maxAttempts then error("Ran out of attempts") end
	end
until http.checkURL(url .. "/" .. area)

term.clear()
term.setCursorPos(1, 1)

repeat
	write("Please set coordinates\n")
	write("X: ")
	if not x then x = read() end

	term.clear()
	term.setCursorPos(1, 1)
	write("Invalid Number\n")
	write("\n")
until tonumber(x) ~= nil

term.clear()
term.setCursorPos(1, 1)

repeat
	write("Please set coordinates\n")
	write("Y: ")
	if not y then y = read() end

	term.clear()
	term.setCursorPos(1, 1)

	write("Invalid Number\n")
	write("\n")
until tonumber(y) ~= nil

term.clear()
term.setCursorPos(1, 1)

repeat
	write("Please set coordinates\n")
	write("Z: ")
	if not z then z = read() end

	term.clear()
	term.setCursorPos(1, 1)

	write("Invalid Number\n")
	write("\n")
until tonumber(z) ~= nil

term.clear()
term.setCursorPos(1, 1)

function checkFace(n)
	if tonumber(n) == nil then return false end

	if tonumber(n) > 4 then return false end
	if 1 > tonumber(n) then return false end

	return true
end

repeat
	write("Input turtle facing direction")
	write("\n")
	write("\n 1 = North")
	write("\n 2 = East")
	write("\n 3 = South")
	write("\n 4 = West")
	write("\n\n")

	write("Facing: ")
	if not facing then facing = read() end

	term.clear()
	term.setCursorPos(1, 1)

	write("Invalid direction\n\n")
until checkFace(facing)

term.clear()
term.setCursorPos(1, 1)

repeat
	print("Coordinates : \n\nX: " .. x .. "\nY: " .. y .. "\nZ: " .. z .. "\nFacing: " .. facing .. "\n")

	write("Correct?\n\n")
	write("[Y/N] : ")
	if not ans then ans = read() end

	term.clear()
	term.setCursorPos(1, 1)
until string.lower(ans) == "y" or string.lower(ans) == "n"

if string.lower(ans) == "n" then os.reboot() end

if disk then
    
    local File = fs.open( disk.getMountPath() .. "/data/info.txt", "w" )
    
    File.write(
        url.."\n"
        //..x.."\n"
        //..y.."\n"
        //..z.."\n"
        //..facing.."\n"
        ..ans.."\n"
    )
    
    File.close()
    
end

term.clear()
term.setCursorPos(1, 1)

local textdata = ""
local data = {}

data.turtleX = x or 0
data.turtleY = y or 0
data.turtleZ = z or 0
data.turtleFacing = facing or 1

data.index = index
data.id = os.getComputerID() or 0
data.name = os.getComputerLabel() or ""

for index, value in pairs(data) do
	textdata = textdata .. index .. "=" .. value .. "&"
end

local result = http.post(
	url .. "/" .. area,
	textdata
)

if not result then
	write("Link invalid\n\n")
	sleep(1.5)
	os.reboot()
end

local connectionURL = result.readAll()

local Connected = false
local SocketAttempts = 0

local ws = nil

function wait_for_char()
	if not ws then return end

	repeat
		local event, char = os.pullEvent("char")
	until char

	write("Rebooting!")
	sleep(0.25)
	os.reboot()
end

function retryConnection()
	SocketAttempts = 0

	repeat
		term.clear()
		term.setCursorPos(1, 1)

		SocketAttempts = SocketAttempts + 1
		print("\nAttempt " .. SocketAttempts .. "\n")
		print("Connecting to:\n\n'" .. connectionURL .. "'..")

		ws = http.websocket(connectionURL)

		if ws then
			Connected = true
		else
			sleep(2)
		end
	until Connected and ws

	print("Connceted!")

	sleep(2)

	term.clear()
	term.setCursorPos(1, 1)

	local Data = {}

	Data.index = index

	ws.send(textutils.serialiseJSON(Data), false)

	while true do
		local jsonData = nil

		local success, err = pcall(
			function()
				local data = ws.receive()
				jsonData = textutils.unserialiseJSON(data)
			end
		)

		if success then
			local command = jsonData.command

			local func = assert(loadstring("R1, R2, R3, R4, R5, R6, R7, R8, R9=" .. command))

			status, e = pcall(
				function()
					func()

					local returnData = {}

					returnData.ID = jsonData.ID
					returnData.Result = { R1, R2, R3, R4, R5, R6, R7, R8, R9 }

					ws.send(textutils.serialiseJSON(returnData))
				end)
		end

		if err then
			parallel.waitForAll(retryConnection, wait_for_char)
			return
		end

		sleep(0.1)
	end
end

parallel.waitForAll(retryConnection, wait_for_char)
