import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ShoppingBag, Heart, Parachute, Sparkle, Lightning, Shield } from '@phosphor-icons/react'
import { toast } from 'sonner'

export interface PowerUp {
  id: string
  name: string
  description: string
  cost: number
  icon: typeof Heart
  owned: number
}

interface ShopModalProps {
  points: number
  powerUps: PowerUp[]
  onPurchase: (powerUpId: string) => void
}

export function ShopModal({ points, powerUps, onPurchase }: ShopModalProps) {
  const handlePurchase = (powerUp: PowerUp) => {
    if (points >= powerUp.cost) {
      onPurchase(powerUp.id)
      toast.success(`Purchased ${powerUp.name}!`, {
        description: `You now have ${powerUp.owned + 1} ${powerUp.name}`,
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
        <Button variant="default" size="lg" className="gap-2">
          <ShoppingBag size={20} weight="fill" />
          Shop
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Power-Up Shop</DialogTitle>
          <DialogDescription className="text-base">
            Use your points to purchase power-ups that help you in the game
          </DialogDescription>
          <div className="flex items-center gap-2 pt-2">
            <Sparkle weight="fill" className="text-accent" size={24} />
            <span className="text-2xl font-bold text-foreground">{points}</span>
            <span className="text-muted-foreground">points available</span>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {powerUps.map((powerUp) => {
            const Icon = powerUp.icon
            const canAfford = points >= powerUp.cost
            
            return (
              <Card key={powerUp.id} className={!canAfford ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon size={24} weight="fill" className="text-primary" />
                      <CardTitle className="text-lg">{powerUp.name}</CardTitle>
                    </div>
                    {powerUp.owned > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        x{powerUp.owned}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {powerUp.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-0">
                  <div className="flex items-center gap-1 text-accent font-semibold">
                    <Sparkle weight="fill" size={16} />
                    <span>{powerUp.cost}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handlePurchase(powerUp)}
                    disabled={!canAfford}
                  >
                    Purchase
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const AVAILABLE_POWERUPS: Omit<PowerUp, 'owned'>[] = [
  {
    id: 'extra-life',
    name: 'Extra Life',
    description: 'Resume from where you died once',
    cost: 150,
    icon: Heart,
  },
  {
    id: 'low-gravity',
    name: 'Low Gravity',
    description: 'Jump higher and farther for one game',
    cost: 100,
    icon: Parachute,
  },
  {
    id: 'slow-motion',
    name: 'Slow Motion',
    description: 'Reduce game speed by 30% for one game',
    cost: 120,
    icon: Lightning,
  },
  {
    id: 'shield',
    name: 'Shield',
    description: 'Survive one collision without dying',
    cost: 180,
    icon: Shield,
  },
  {
    id: 'point-multiplier',
    name: 'Point Multiplier',
    description: '2x points earned for one game',
    cost: 200,
    icon: Sparkle,
  },
]
