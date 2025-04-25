"use client"

import { motion } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Influencer } from "./influencer-dashboard"

interface DeleteConfirmationModalProps {
  influencer: Influencer
  onClose: () => void
  onDelete: () => void
}

export function DeleteConfirmationModal({ influencer, onClose, onDelete }: DeleteConfirmationModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-medium">Delete Influencer</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-yellow-500/10 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-medium">Confirm Deletion</h3>
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            </div>
          </div>

          <p className="mb-4">
            Are you sure you want to delete <span className="font-medium">{influencer.name}</span>?
          </p>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-0"
            >
              Delete
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
