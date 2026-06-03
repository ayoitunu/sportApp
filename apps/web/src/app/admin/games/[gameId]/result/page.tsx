import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ResultForm } from '@/components/admin/ResultForm'

export default async function ResultPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params
  const supabase = await createClient()
  const { data: game } = await supabase
    .from('games')
    .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)')
    .eq('id', gameId)
    .single()

  if (!game) notFound()

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enter Result</h1>
        <p className="text-gray-500 mt-1">
          {(game.home_team as {name:string}).name} vs {(game.away_team as {name:string}).name}
        </p>
      </div>
      <ResultForm
        gameId={gameId}
        homeTeamName={(game.home_team as {name:string}).name}
        awayTeamName={(game.away_team as {name:string}).name}
        currentHomeScore={game.home_score}
        currentAwayScore={game.away_score}
      />
    </div>
  )
}
