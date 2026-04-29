import { Bell, BellOff } from 'lucide-react';

export function NotificationsPage() {
    return (
        <div className="py-6">
            {/* Page Title */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Bell className="w-6 h-6 text-[#2F80FF]" />
                    알림함
                </h2>
                <p className="text-muted-foreground mt-1">새로운 소식을 확인하세요</p>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                    <BellOff className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    알림이 없습니다
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                    새로운 알림이 도착하면 여기에 표시됩니다.
                    운동 리마인더, 대회 소식 등의 알림을 받아보세요!
                </p>
            </div>
        </div>
    );
}
