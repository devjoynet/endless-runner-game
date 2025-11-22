import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Card, CardContent, CardDesc
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ShoppingBag, Heart, Parachute, Sparkle, Lightning, Shield } from '@phosphor-icons/react'
import { toast } from 'sonner'

export interface PowerUp {
interface Sh
  powerUps: Po
}
export functio
    if (points >= po
      toast.suc
 

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
        
    } else {
      toast.error('Not enough points!', {
        description: `You need ${powerUp.cost - points} more points`,
        
    }
   

          
    <Dialog>
                  <CardDescri
        <Button variant="default" size="lg" className="gap-2">
          <ShoppingBag size={20} weight="fill" />
          Shop
        </Button>
      </DialogTrigger>
                    disabled={!canAfford}
        <DialogHeader>
          <DialogTitle className="text-2xl">Power-Up Shop</DialogTitle>
          <DialogDescription className="text-base">
            Use your points to purchase power-ups that help you in the game
          </DialogDescription>
          <div className="flex items-center gap-2 pt-2">
            <Sparkle weight="fill" className="text-accent" size={24} />
            <span className="text-2xl font-bold text-foreground">{points}</span>
            <span className="text-muted-foreground">points available</span>
    icon: Heart,
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {powerUps.map((powerUp) => {
            const Icon = powerUp.icon
            const canAfford = points >= powerUp.cost
            
  {
              <Card key={powerUp.id} className={!canAfford ? 'opacity-60' : ''}>
    cost: 180,
  },
    id: 'point-multiplier',
    description: '2x points earned for one game',
    icon: Sparkle,
]


























































    cost: 180,

  },

    id: 'point-multiplier',

    description: '2x points earned for one game',

    icon: Sparkle,

]
