import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ShoppingBag, Heart, Parachute, Sparkle, Lightning, Shield } from '@phosphor-icons/react'
import { toast } from 'sonner'

export interface PowerUp {
  id: string
  name: string
  description: string
  cost: number
  icon: typeof Heart
  owned?: number
}

interface ShopModalProps {
  points: number
  powerUps: PowerUp[]
  onPurchase: (powerUpId: string) => void
}

export const AVAILABLE_POWERUPS: PowerUp[] = [
  {
    id: 'extra-life',
    name: 'Extra Life',
    description: 'Get one free continue when you die',
    cost: 100,
    icon: Heart,
  },
  {
    id: 'low-gravity',
    name: 'Low Gravity',
    description: 'Jump higher and float longer',
    cost: 80,
    icon: Parachute,
  },
  {
    id: 'slow-motion',
    name: 'Slow Motion',
    description: 'Everything moves slower',
    cost: 120,
    icon: Lightning,
  },
  {
    id: 'shield',
    name: 'Shield',
    description: 'Absorb one hit from obstacles',
    cost: 150,
    icon: Shield,
  },
  {
    id: 'point-multiplier',
    name: 'Point Multiplier',
    description: 'Earn 2x points for one game',
    cost: 90,
    icon: Sparkle,
  },
]

export function ShopModal({ points, powerUps, onPurchase }: ShopModalProps) {
  const handlePurchase = (powerUp: PowerUp) => {
    if (points >= powerUp.cost) {
      onPurchase(powerUp.id)
      toast.success(`Purchased ${powerUp.name}!`, {
        description: 'Use it before starting a game',
      })
    } else {
      toast.error('Not enough points!', {
        description: `You need ${powerUp.cost - points} more points`,
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ShoppingBag size={20} />
          <span className="hidden sm:inline">Shop</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Power-Up Shop</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <span>Available Points:</span>
              <Badge variant="default" className="bg-accent text-accent-foreground">
                <Sparkle weight="fill" size={16} className="mr-1 inline" />
                <span className="font-semibold">{points}</span>
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {powerUps.map((powerUp) => {
            const Icon = powerUp.icon
            const canAfford = points >= powerUp.cost
            const owned = powerUp.owned ?? 0

            return (
              <Card key={powerUp.id} className={!canAfford ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon weight="fill" size={24} className="text-primary" />
                      <CardTitle className="text-lg">{powerUp.name}</CardTitle>
                    </div>
                    {owned > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        x{owned}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{powerUp.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkle weight="fill" size={16} className="text-accent" />
                      <span className="font-bold text-lg">{powerUp.cost}</span>
                    </div>
                    <Button
                      onClick={() => handlePurchase(powerUp)}
                      disabled={!canAfford}
                      size="sm"
                      className="w-20"
                    >
                      Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
