"use client"
import { useState } from "react"
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Coffee,
  Wifi,
  Power,
  RockingChairIcon as ChairSeat,
  Car,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Map, Placemark, YMaps } from "react-yandex-maps"

// Define the structure of a coffee shop
interface CoffeeShop {
  id: number
  name: string
  location: [number, number]
  distance: string
  status: string
  outlets: number
  seats: number
  wifiSpeed: string
  parking: string
}

// Static data simulating a database or API response
const STATIC_DATA: CoffeeShop[] = [
  {
    id: 1,
    name: "Starbucks - Sunrise & Zinfandel",
    location: [41.311081, 69.240562],
    distance: "0.1 mi",
    status: "Open 'til 6pm",
    outlets: 8,
    seats: 15,
    wifiSpeed: "20 Mbps",
    parking: "Street",
  },
  {
    id: 2,
    name: "Shady Coffee & Tea",
    location: [41.283463, 69.339798],
    distance: "0.3 mi",
    status: "Open 'til 6pm",
    outlets: 16,
    seats: 24,
    wifiSpeed: "30 Mbps",
    parking: "Private Lot",
  },
  {
    id: 3,
    name: "Philz Coffee Midtown",
    location: [41.364664, 69.287714],
    distance: "0.5 mi",
    status: "Open 'til 8pm",
    outlets: 10,
    seats: 20,
    wifiSpeed: "25 Mbps",
    parking: "Garage",
  },
]

export default function CoffeeFinder() {
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>(STATIC_DATA)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("open")
  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null)

  // Filter coffee shops based on search term and status
  const filteredCoffeeShops = coffeeShops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.distance.includes(searchTerm) ||
      shop.status.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || shop.status.toLowerCase().includes(filterStatus.toLowerCase())

    return matchesSearch && matchesStatus
  })

  return (
    <div className="h-screen w-full flex">
      {/* Main content */}
      <div className="flex-1 relative">
        {/* Map placeholder */}
        <YMaps>
          <Map
            className="h-screen w-full"
            defaultState={{
              center: selectedShop ? selectedShop.location : [41.311081, 69.240562],
              zoom: selectedShop ? 24 : 12,
            }}
          >
            {filteredCoffeeShops.map((shop) => (
              <Placemark
                key={shop.id}
                geometry={shop.location}
                options={{
                  preset: selectedShop?.id === shop.id ? "islands#redDotIcon" : "islands#blueDotIcon", // Change color and size
                  iconColor: selectedShop?.id === shop.id ? "#FF0000" : "#0000FF", // Custom colors
                  iconLayout: "default#image",
                  iconImageSize: selectedShop?.id === shop.id ? [40, 40] : [20, 20], // Enlarge selected marker
                  iconImageOffset: [-20, -40], // Adjust offset for proper alignment
                }}
                onClick={() => setSelectedShop(shop)}
              />
            ))}
          </Map>
        </YMaps>
        <div className="w-full h-full bg-muted/10">
          {/* Location card */}
          {selectedShop ? (
            <div className="absolute top-24 left-4 bg-white rounded-lg shadow-lg p-4 w-80">
              <div className="flex items-start gap-3">
                <img src="/car.png" alt={selectedShop.name} width={40} height={40} className="rounded" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{selectedShop.name}</h3>
                    <div className="bg-blue-500 rounded-full p-1">
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedShop.distance} • Location Placeholder
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Power className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{selectedShop.outlets}</div>
                    <div className="text-xs text-muted-foreground">Outlets</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ChairSeat className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{selectedShop.seats}</div>
                    <div className="text-xs text-muted-foreground">Seats</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{selectedShop.wifiSpeed}</div>
                    <div className="text-xs text-muted-foreground">Wi-Fi Average</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{selectedShop.parking}</div>
                    <div className="text-xs text-muted-foreground">Parking Area</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute top-24 left-4 bg-white rounded-lg shadow-lg p-4 w-80">
              <p className="text-sm text-muted-foreground">Select a coffee shop to view details.</p>
            </div>
          )}
        </div>
      </div>
      {/* Sidebar */}
      <div className="w-80 border-l">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <img src="/car.png" alt="OutletBuddy" width={32} height={32} className="rounded-lg" />
            <span className="font-semibold">outletbuddy</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="text-sm text-muted-foreground">Show me:</div>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Show me" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open Now</SelectItem>
                <SelectItem value="all">All Places</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="ml-auto">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Coffee shop list */}
        <div className="overflow-auto">
          {filteredCoffeeShops.map((shop, i) => (
            <div
              key={shop.id}
              className={cn(
                "p-4 flex items-center gap-3 hover:bg-muted/5 cursor-pointer",
                selectedShop?.id === shop.id && "bg-muted/5"
              )}
              onClick={() => setSelectedShop(shop)}
            >
              <img src="/car.png" alt={shop.name} width={40} height={40} className="rounded" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{shop.name}</h3>
                  <Coffee className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {shop.distance} • {shop.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}