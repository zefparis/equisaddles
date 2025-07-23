import { useEffect } from "react";
import { useLanguage } from "../hooks/use-language";
import { scrollToTop } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  RotateCcw, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Mail, 
  FileText,
  Truck,
  CreditCard,
  AlertTriangle,
  Phone
} from "lucide-react";

export default function Returns() {
  const { t } = useLanguage();

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <RotateCcw className="h-10 w-10 text-primary" />
            {t("legal.returns.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("legal.returns.subtitle")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800">{t("returns.days14")}</h3>
                <p className="text-sm text-green-700">{t("returns.days14desc")}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800">{t("returns.days30")}</h3>
                <p className="text-sm text-blue-700">{t("returns.days30desc")}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-800">{t("returns.refund")}</h3>
                <p className="text-sm text-purple-700">{t("returns.refundDesc")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Return Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("returns.policy.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-blue-800">
                  <strong>{t("returns.policy.satisfaction")} :</strong> {t("returns.policy.satisfactionDesc")}
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {t("returns.accepted.title")}
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>{t("returns.accepted.unsuitable")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>{t("returns.accepted.defective")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>{t("returns.orderError")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>{t("returns.withdrawal")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>{t("returns.nonCompliant")}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    {t("returns.refused.title")}
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>{t("returns.refused.used")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>{t("returns.refused.damaged")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>{t("returns.originalPackaging")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>{t("returns.timeExpired")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>{t("returns.customProducts")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t("returns.process.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Badge className="min-w-8 h-8 rounded-full flex items-center justify-center">1</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">{t("returns.process.step1")}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {t("returns.process.step1desc")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("returns.process.step1info")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge className="min-w-8 h-8 rounded-full flex items-center justify-center">2</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">{t("returns.process.step2")}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {t("returns.process.step2desc")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("returns.process.step2delay")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge className="min-w-8 h-8 rounded-full flex items-center justify-center">3</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">{t("returns.process.step3")}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {t("returns.process.step3desc")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("returns.process.step3advice")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge className="min-w-8 h-8 rounded-full flex items-center justify-center">4</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">{t("returns.process.step4")}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {t("returns.process.step4desc")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("returns.process.step4receipt")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge className="min-w-8 h-8 rounded-full flex items-center justify-center">5</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">{t("returns.process.step5")}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {t("returns.process.step5desc")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("returns.process.step5email")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
{t("exchange.policy.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">{t("exchange.free.title")}</h4>
                <p className="text-sm text-green-700">
                  <strong>{t("exchange.free.subtitle")} :</strong> {t("exchange.free.desc")}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t("exchange.conditions.title")}</h4>
                  <ul className="text-sm space-y-1">
                    <li>• {t("exchange.condition1")}</li>
                    <li>• {t("exchange.condition2")}</li>
                    <li>• {t("exchange.condition3")}</li>
                    <li>• {t("exchange.condition4")}</li>
                    <li>• {t("exchange.condition5")}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">{t("exchange.types.title")}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                      <h5 className="font-medium text-blue-800">{t("exchange.size.title")}</h5>
                      <p className="text-sm text-blue-600">
                        {t("exchange.size.desc")}
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-3">
                      <h5 className="font-medium text-purple-800">{t("exchange.model.title")}</h5>
                      <p className="text-sm text-purple-600">
                        {t("exchange.model.desc")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Costs & Refunds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
{t("costs.refunds.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">{t("costs.return.title")}</h4>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded">
                      <h5 className="font-medium text-green-800">{t("costs.free.title")}</h5>
                      <ul className="text-sm text-green-700 mt-1">
                        <li>• {t("costs.free.defective")}</li>
                        <li>• {t("costs.free.ourError")}</li>
                        <li>• {t("costs.free.exchange")}</li>
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded">
                      <h5 className="font-medium text-orange-800">{t("costs.charged.title")}</h5>
                      <ul className="text-sm text-orange-700 mt-1">
                        <li>• {t("costs.charged.withdrawal")}</li>
                        <li>• {t("costs.charged.changeOfMind")}</li>
                        <li>• {t("costs.charged.cost")}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">{t("refund.terms.title")}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t("refund.processing.time")}</span>
                      <span className="font-medium">{t("refund.processing.duration")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("refund.refund.time")}</span>
                      <span className="font-medium">{t("refund.refund.duration")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("refund.payment.method")}</span>
                      <span className="font-medium">{t("refund.payment.original")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("refund.delivery.costs")}</span>
                      <span className="font-medium">{t("refund.delivery.notRefunded")}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {t("refund.delivery.note")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transport Responsibility */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Truck className="h-5 w-5" />
{t("transport.responsibility.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="bg-yellow-100 border-yellow-300">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-yellow-800">
                  <strong>{t("transport.important")}</strong> {t("transport.disclaimer")}
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 space-y-2 text-sm">
                <h5 className="font-semibold">{t("transport.recommendations")}</h5>
                <ul className="space-y-1">
                  <li>• {t("transport.rec1")}</li>
                  <li>• {t("transport.rec2")}</li>
                  <li>• {t("transport.rec3")}</li>
                  <li>• {t("transport.rec4")}</li>
                  <li>• {t("transport.rec5")}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">{t("returns.contact.question.title")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t("returns.contact.email")}
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t("returns.contact.phone")}
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  {t("returns.contact.availability")}<br />
                  {t("returns.contact.response")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}