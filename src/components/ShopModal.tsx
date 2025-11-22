import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
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

export const AVAILABLE_POWERUPS: Omit<PowerUp, 'owned'>[] = [
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
    description: 'Jump higher and fall slower for one game',
    cost: 80,
    icon: Parachute,
  },
  {
    id: 'slow-motion',
    name: 'Slow Motion',
    description: 'Obstacles move 30% slower for one game',
    cost: 120,
    icon: Lightning,
  },
  {
    id: 'shield',
    name: 'Shield',
    description: 'Absorb one hit without dying',
    cost: 150,
    icon: Shield,
  },
  {
    id: 'point-multiplier',
    name: '2x Points',
    description: '2x points earned for one game',
    cost: 180,
    icon: Sparkle,
  },
]

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon weight="fill" size={24} className="text-primary" />
                    {powerUp.name}
                  </CardTitle>
                  <CardDescription>{powerUp.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkle weight="fill" className="text-accent" size={16} />
                      <span className="text-lg font-bold">{powerUp.cost}</span>
                    </div>
                    {powerUp.owned > 0 && (
                      <Badge variant="secondary" className="text-sm">
                        Owned: {powerUp.owned}
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => handlePurchase(powerUp)}
                    disabled={!canAfford}
                    className="w-full"
                    variant={canAfford ? 'default' : 'secondary'}
                  >
                    {canAfford ? 'Purchase' : 'Not Enough Points'}
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
