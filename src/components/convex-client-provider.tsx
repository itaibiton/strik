'use client'

import { ReactNode, useEffect } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth, useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <UserSyncProvider>
                {children}
            </UserSyncProvider>
        </ConvexProviderWithClerk>
    )
}

// Component that handles syncing user data with Convex when they sign in
function UserSyncProvider({ children }: { children: ReactNode }) {
    const { isSignedIn, user } = useUser()
    const upsertUser = useMutation(api.users.upsertUser)

    useEffect(() => {
        if (isSignedIn && user) {
            // Sync user data with Convex when they sign in
            upsertUser({
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress || '',
                firstName: user.firstName || undefined,
                lastName: user.lastName || undefined,
                imageUrl: user.imageUrl || undefined,
            }).catch((error) => {
                console.error('Failed to sync user with Convex:', error)
            })
        }
    }, [isSignedIn, user, upsertUser])

    return <>{children}</>
}